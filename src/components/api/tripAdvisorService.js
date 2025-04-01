import axios from 'axios';


//It will change the URL, when it publish
const BASE_URL = import.meta.env.PROD
  ? 'https://travel-advisor-seven-mu.vercel.app/api'
  : 'http://localhost:3000/api';

// Create axios
const apiClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
});

/**
 * Search the position
 * @param {string} searchQuery - search key word
 * @param {string} category - Type ('hotels', 'attractions', 'restaurants', 'geos')
 * @returns {Promise} - return value
 */
export const searchLocations = async (searchQuery, category = null) => {
    try {
        const params = {
            searchQuery,
            ...(category && { category }),
        };
  
      const { data } = await apiClient.get('/location/search', { params });
      return data;
    } catch (error) {
        console.error('An error occurred while searching for a location:', error);
        throw error;
    }
};


/**
 * Get location detail
 * @param {string} locationId - geoID
 * @returns {Promise} - return location detail
*/
export const getLocationDetails = async (locationId) => {
    try {
        const { data } = await apiClient.get(`/location/${locationId}/details`);
        return data;
    } catch (error) {
        console.error('An error occurred while searching for a location:', error);
        throw error;
    }
};

/**
    * Optimized aggregation interface: get details and photos only for the first search result
    * @param {string} searchQuery - Search key words
    * @param {string} [category] - Type ('hotels', 'attractions', 'restaurants', 'geos')
    * @returns {Promise} - Returns data containing search results, first location details and photos
*/
export const getFirstLocationData = async (searchQuery, category = null) => {
    try {
        console.log(`Fetching first location data for: ${searchQuery}, category: ${category || 'all'}`);
  
        // 1. Search position
        const searchParams = {
            searchQuery,
            ...(category && { category }),
        };
  
        const searchResponse = await apiClient.get('/location/search', { params: searchParams });
        const searchResults = searchResponse.data;
  
        // If no data return back, then return
        if (!searchResults?.data?.length) {
            console.log(`No results found for: ${searchQuery}`);
            return { data: null };
        }
  
        // 2. Only get first match data
        const firstLocation = searchResults.data[0];
        const locationId = firstLocation.location_id;
    
        console.log(`Found location: ${firstLocation.name} (ID: ${locationId})`);
    
        // 3. Get the location detail
        const detailsResponse = await apiClient.get(`/location/${locationId}/details`);
        const locationDetails = detailsResponse.data;
    
        // 4. Get location photo
        const photosResponse = await apiClient.get(`/location/${locationId}/photos`);
        const locationPhotos = photosResponse.data;
    
        // 5. Combine the data
        const result = {
            ...firstLocation,
            locationDetails,
            locationPhotos: locationPhotos.data
        };
    
        return { data: result };
    } catch (error) {
        console.error('An error occurred while searching for a location:', error);
        return { data: null, error: error.message };
    }
};

/**
    * Get city location detail
    * @param {string} cityName - City name
    * @returns {Promise} - return city location detail
*/
export const getCityInfo = (() => {
    let isFetching = false; // modular lock
    const cache = new Map(); // Save the data
  
    return async (cityName) => {
        try {
            if (!cityName) return null;
    
            // check cache
            if (cache.has(cityName)) {
                console.log("Get from cache:", cityName);
                return cache.get(cityName);
            }
    
            // check modular lock
            if (isFetching) {
                console.log("Request is locked, please waiting:", cityName);
                await new Promise((resolve) => setTimeout(resolve, 100)); 
                return cache.has(cityName) ? cache.get(cityName) : null; // return or get null
            }
    
            console.log("Fetching city info for:", cityName);
            isFetching = true; // modular lock
    
            // Get city data 
            const response = await getFirstLocationData(cityName, 'geos');
    
            // If there is no data, then return null
            if (!response.data) {
                console.log("No city info found for:", cityName);
                cache.set(cityName, null);
            } else {
                console.log("City info found:", response.data);
                cache.set(cityName, response.data);
            }
    
            return response.data;
        } catch (error) {
            console.error("Error fetching city info:", error);
            cache.set(cityName, null);
            return null;
        } finally {
            isFetching = false; // unlock
        }
    };
})();

/**
    * Access to categorized geographic information
    * @param {string} searchQuery - Search key words
    * @param {string} [category] - Type ('hotels', 'attractions', 'restaurants', 'geos')
    * @returns {Promise} - return categorized geographic information
*/
export const getAggregatedLocationDataAll = (() => {
    const fetchPromises = new Map(); // Storing Promises in Progress
  
    return async (searchQuery, category = null) => {
        const key = `${searchQuery}:${category || 'none'}`; // Unique key for locks

        try {
            if (!searchQuery) return null;
  
            // Check if there are requests in progress
            if (fetchPromises.has(key)) {
                console.log("Already requested, please waiting:", key);
                return fetchPromises.get(key);
            }
  
            console.log("Fetching aggregated info for:", key);
            const promise = getAggregatedLocationData(searchQuery, category)
                .then((response) => {
                    console.log("聚合1response", response);
                    if (!response?.data) {
                        console.log("No aggregated info found for:", key);
                        return null;
                    }
                    console.log("Aggregated info found:", response.data);
                    return response.data;
                })
                .catch((error) => {
                    console.error("Error fetching aggregated info:", error);
                    return null;
                })
                .finally(() => {
                    fetchPromises.delete(key); // detele cache
                });
  
            fetchPromises.set(key, promise);
            return promise;
        } catch (error) {
            console.error("Unexpected error:", error);
            return null;
        }
    };
})();

/**
    * Search for locations and get details and photos of all results
    * @param {string} searchQuery - Search key words
    * @param {string} [category] - type ('hotels', 'attractions', 'restaurants', 'geos')
    * @returns {Promise} - return locations and details and photos of all results
*/
export const getAggregatedLocationData = async (searchQuery, category = null) => {
    try {
        // 1. search location
        const searchParams = {
                searchQuery,
            ...(category && { category }),
        };
  
        const searchResponse = await apiClient.get('/location/search', { params: searchParams });
        const searchResults = searchResponse.data;
  
        // If no data return back, then return
        if (!searchResults?.data?.length) {
            return {
            data: []
            };
        }
  
        // 2. Get details and photos for each search result
        const aggregatedData = await Promise.all(
                searchResults.data.map(async (location) => {
                const locationId = location.location_id;
  
                // Get location detail
                const detailsResponse = await apiClient.get(`/location/${locationId}/details`);
                const locationDetails = detailsResponse.data;
  
                // Get photo
                const photosResponse = await apiClient.get(`/location/${locationId}/photos`);
                const locationPhotos = photosResponse.data;
  
                // Combining Data
                return {
                    ...location,           // Keep origin string
                    ...locationDetails,       // Add detail
                    locationPhotos: locationPhotos.data  // Add photo
                };
  
            })
        );
  
                        console.log("Aggregated Data:", aggregatedData);
  
        // 3. return 
        return {
            data: aggregatedData
        };
  
    } catch (error) {
        console.error('Have error when Aggregated data:', error);
        throw error;
    }
}