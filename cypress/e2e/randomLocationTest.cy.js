Cypress.config('defaultCommandTimeout', 60000)
describe('Recommended Destination Test', () => {
    it('Recommended destination works as it should', () => {
        // Checks if the home page is accessible and shows up as expected
        cy.intercept('POST', 'https://api.openai.com/v1/chat/completions').as('apiRequestChat')
        cy.intercept('GET', 'https://travel-advisor-seven-mu.vercel.app/api/location/**').as('apiRequestTravel')
        cy.visit('http://localhost:5173/group10-finalproject/')
        cy.getDataTest('Website-Name').should('contain.text', 'TRAVEL ADVISOR')

        // Checks if next button is clickable if no choice is chosen
        cy.getDataTest('Start-Button').click()
        cy.getDataTest('Next-Button-AiRec').should('be.disabled')
        cy.getDataTest('Recommend-Button').click()
        cy.getDataTest('Next-Button-AiRec').should('be.enabled')
        cy.getDataTest('Next-Button-AiRec').click()

        // Checks if all functions of adding a traveler's passport and visa is all good
        cy.getDataTest('Remove-Button-1').should('not.exist')
        cy.getDataTest('Visa-Remove-1').should('not.exist')
        cy.getDataTest('Visa-ID-1').type('China{enter}')
        cy.getDataTest('Next-Button-Pass').should('be.disabled')
        cy.getDataTest('Visa-Remove-1').should('exist')
        cy.getDataTest('Visa-Remove-1').click()
        cy.getDataTest('Visa-ID-1').type('Russia')
        cy.getDataTest('Visa-Button-1').click()
        cy.getDataTest('Traveler-ID-1').type('Canada')
        cy.getDataTest('Next-Button-Pass').should('be.enabled')
        cy.getDataTest('Add-Traveler').click()

        // Checks the functionalities of adding a second traveler
        cy.getDataTest('Remove-Button-2').should('exist')
        cy.getDataTest('Visa-Remove-2').should('not.exist')
        cy.getDataTest('Visa-ID-2').type('USA{enter}')
        cy.getDataTest('Visa-Remove-2').should('exist')
        cy.getDataTest('Visa-Remove-2').click()
        cy.getDataTest('Visa-ID-2').type('Canada')
        cy.getDataTest('Visa-Button-2').click()
        cy.getDataTest('Traveler-ID-2').type('China')
        cy.getDataTest('Remove-Button-2').click()
        cy.getDataTest('Next-Button-Pass').click()

        // Checks to see if picking the start date works like expected         
        cy.getDataTest('Next-Button-Cal').should('be.disabled')
        cy.getDataTest('Calender-Button').click()
        const today = new Date().getDate()
        for (let i = 1; i < today; i++) {
            cy.getDataTest(`Date-${i}`).should('be.disabled')
        }
        cy.getDataTest('Previous-Month').click()
        cy.getDataTest('Next-Month').click().click()
        cy.getDataTest('Date-15').click()
        cy.getDataTest('Next-Button-Cal').should('be.enabled')
        cy.getDataTest('Next-Button-Cal').click()

        // Checks to see if picking the end date works like expected
        cy.getDataTest('Next-Button-Cal').should('be.disabled')
        cy.getDataTest('Calender-Button').click()
        cy.getDataTest('Next-Month').click()
        for (let i = 1; i < 15; i++) {
            cy.getDataTest(`Date-${i}`).should('be.disabled')
        }
        cy.getDataTest('Date-30').click()
        cy.getDataTest('Trip-Duration').should('contain.text', 'Trip duration: 16 days')
        cy.getDataTest('Next-Button-Cal').click()

        // Checks if all the information is received and correct
        cy.wait('@apiRequestChat').its('response.statusCode').should('eq', 200)
        cy.wait('@apiRequestTravel').its('response.statusCode').should('eq', 200)
        cy.getDataTest('Results-Text').should('contain.text', 'THE DESTINATION DESIGNATED FOR YOU AWAITS')
        cy.getDataTest('Traveler-Number').should('contain.text', '1 person')
        cy.getDataTest('Travel-Date').should('contain.text', 'May 15, 2025 - May 30, 2025')
        cy.getDataTest('Travel-Duration').should('contain.text', '16 days')
        cy.wait('@apiRequestTravel').its('response.statusCode').should('eq', 200)
        cy.getDataTest('Reload-Button').should('be.enabled')
        cy.wait('@apiRequestTravel').its('response.statusCode').should('eq', 200)
        cy.getDataTest('Reload-Button').click()
        cy.wait('@apiRequestTravel').its('response.statusCode').should('eq', 200)
        cy.getDataTest('Category-Button-Attractions').click()
        cy.wait('@apiRequestTravel').its('response.statusCode').should('eq', 200)
        cy.getDataTest('Reload-Button').click()
        cy.wait('@apiRequestTravel').its('response.statusCode').should('eq', 200)
        cy.getDataTest('Category-Button-Restaurants').click()
        cy.wait('@apiRequestTravel').its('response.statusCode').should('eq', 200)
        cy.getDataTest('Reload-Button').click()
        cy.wait('@apiRequestTravel').its('response.statusCode').should('eq', 200)
        cy.getDataTest('Category-Button-Hotels').click()
        cy.getDataTest('Category-Button-Itinerary').click()
        
        // Checks to make sure all days are generated
        cy.getDataTest('Itinerary-Button').click()
        cy.wait('@apiRequestChat').its('response.statusCode').should('eq', 200)
        for (let i = 1; i < 17; i++) {
            cy.getDataTest(`Day-${i}`).should('contain.text', `Day ${i}`);
        }        
        cy.getDataTest('Another-Itinerary').should('be.enabled')
        cy.getDataTest('Another-Itinerary').click()
        cy.wait('@apiRequestChat').its('response.statusCode').should('eq', 200)
        for (let i = 1; i < 17; i++) {
            cy.getDataTest(`Day-${i}`).should('contain.text', `Day ${i}`);
        }
        
        // Checks if the back button works
        cy.getDataTest('Results-Back').click()
        cy.getDataTest('End-Date-Back').click()
        cy.getDataTest('Start-Date-Back').click()
        cy.getDataTest('Pass-Back').click()
        cy.getDataTest('Next-Button-AiRec').should('be.disabled')
        cy.getDataTest('AiRec-Back').click()

        // Checks to see if all the information is still saved and outputs a different country
        cy.getDataTest('Start-Button').click()
        cy.getDataTest('Next-Button-AiRec').should('be.disabled')
        cy.getDataTest('Recommend-Button').click()
        cy.getDataTest('Next-Button-AiRec').should('be.enabled')
        cy.getDataTest('Next-Button-AiRec').click()
        cy.getDataTest('Next-Button-Pass').click()
        cy.getDataTest('Next-Button-Cal').click()
        cy.getDataTest('Next-Button-Cal').click()

        // Checks if all the information is recieved and correct again
        cy.wait('@apiRequestChat').its('response.statusCode').should('eq', 200)
        cy.wait('@apiRequestTravel').its('response.statusCode').should('eq', 200)
        cy.getDataTest('Results-Text').should('contain.text', 'THE DESTINATION DESIGNATED FOR YOU AWAITS')
        cy.getDataTest('Traveler-Number').should('contain.text', '1 person')
        cy.getDataTest('Travel-Date').should('contain.text', 'May 15, 2025 - May 30, 2025')
        cy.getDataTest('Travel-Duration').should('contain.text', '16 days')
        cy.getDataTest('Category-Button-Hotels').click()
        cy.wait('@apiRequestTravel').its('response.statusCode').should('eq', 200)
        cy.getDataTest('Reload-Button').click()
        cy.wait('@apiRequestTravel').its('response.statusCode').should('eq', 200)
        cy.getDataTest('Category-Button-Attractions').click()
        cy.wait('@apiRequestTravel').its('response.statusCode').should('eq', 200)
        cy.getDataTest('Reload-Button').click()
        cy.wait('@apiRequestTravel').its('response.statusCode').should('eq', 200)
        cy.getDataTest('Category-Button-Restaurants').click()
        cy.wait('@apiRequestTravel').its('response.statusCode').should('eq', 200)
        cy.getDataTest('Reload-Button').click()
        cy.wait('@apiRequestTravel').its('response.statusCode').should('eq', 200)
        cy.getDataTest('Category-Button-Itinerary').click()
        
        // Checks to see if all days are generated
        cy.getDataTest('Itinerary-Button').click()
        cy.wait('@apiRequestChat').its('response.statusCode').should('eq', 200)
        for (let i = 1; i < 17; i++) {
            cy.getDataTest(`Day-${i}`).should('contain.text', `Day ${i}`);
        }        
        cy.getDataTest('Another-Itinerary').should('be.enabled')
        cy.getDataTest('Another-Itinerary').click()
        cy.wait('@apiRequestChat').its('response.statusCode').should('eq', 200)
        for (let i = 1; i < 17; i++) {
            cy.getDataTest(`Day-${i}`).should('contain.text', `Day ${i}`);
        }
        cy.getDataTest('Start-Over').should('be.enabled')
        cy.getDataTest('Start-Over').click()

        // Check to make sure passport and visa is reset
        cy.getDataTest('Start-Button').click()
        cy.getDataTest('Recommend-Button').click()
        cy.getDataTest('Next-Button-AiRec').click()
        cy.getDataTest('Traveler-ID-1').should('have.value', '')
        cy.getDataTest('Visa-ID-1').should('have.value', '')
        cy.getDataTest('Next-Button-Pass').should('be.disabled')
    })
})