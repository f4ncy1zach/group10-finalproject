import axios from 'axios';

// Based URL for the tripadvisor backend
const BASE_URL = 'https://travel-advisor-seven-mu.vercel.app/api';

// Create axios
const apiClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
});

/**
    * Optimized aggregation interface: get details and photos only for the first search result
    * @param {string} searchQuery - Search keywords
    * @param {string} [category] - Type ('hotels', 'attractions', 'restaurants', 'geos')
    * @returns {Promise} - Returns data containing search results, first location details and photos
*/
export const getFirstLocationData = async (searchQuery, category = null) => {
    try {

        // 1. Search position
        const searchParams = {
            searchQuery,
            ...(category && { category }),
        };
  
        const searchResponse = await apiClient.get('/location/search', { params: searchParams });
        const searchResults = searchResponse.data;
  
        // If no data return back, then return
        if (!searchResults?.data?.length) {
            return { data: null };
        }
  
        // 2. Only get first match data
        const firstLocation = searchResults.data[0];
        const locationId = firstLocation.location_id;
    
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
                return cache.get(cityName);
            }
    
            // check modular lock
            if (isFetching) {
                await new Promise((resolve) => setTimeout(resolve, 100)); 
                return cache.has(cityName) ? cache.get(cityName) : null; // return or get null
            }

            isFetching = true; // modular lock
    
            // Get city data 
            const response = await getFirstLocationData(cityName, 'geos');
    
            // If there is no data, then return null
            if (!response.data) {
                cache.set(cityName, null);
            } else {
                cache.set(cityName, response.data);
            }
    
            return response.data;
        } catch (error) {
            cache.set(cityName, null);
            return null;
        } finally {
            isFetching = false; // unlock
        }
    };
})();

(() => {
    const fetchPromises = new Map(); // Storing Promises in Progress

    return async (searchQuery, category = null) => {
        const key = `${searchQuery}:${category || 'none'}`; // Unique key for locks

        try {
            if (!searchQuery) return null;

            // Check if there are requests in progress
            if (fetchPromises.has(key)) {
                return fetchPromises.get(key);
            }

            const promise = getAggregatedLocationData(searchQuery, category)
                .then((response) => {
                    if (!response?.data) {
                        return null;
                    }
                    return response.data;
                })
                .catch((error) => {
                    return null;
                })
                .finally(() => {
                    fetchPromises.delete(key); // Delete cache
                });

            fetchPromises.set(key, promise);
            return promise;
        } catch (error) {
            return null;
        }
    };
})();

/**
    * Search for locations and get details and photos of all results
    * @param {string} searchQuery - Search key words
    * @param {string} [category] - type ('hotels', 'attractions', 'restaurants', 'geos')
    * @param country
    * @returns {Promise} - return locations and details and photos of all results
*/
export const getAggregatedLocationData = async (searchQuery, category = null, country = null) => {
    try {
        // 1. search location
        const searchParams = {
                searchQuery,
            ...(category && { category }),
            ...(country && { country }),
        };
  
        const searchResponse = await apiClient.get('/location/search', { params: searchParams });
        const searchResults = searchResponse.data;
  
        // If no data return back, then return
        if (!searchResults?.data?.length) {
            return {
            data: []
            };
        }
  
        // Get details and photos for each search result
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
                    ...location,  // Keep origin string
                    ...locationDetails,  // Add detail
                    locationPhotos: locationPhotos.data  // Add photo
                };
  
            })
        );
  
        // return
        return {
            data: aggregatedData
        };
  
    } catch (error) {
        throw error;
    }
}