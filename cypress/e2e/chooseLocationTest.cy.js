describe('Own Destination Test', () => {
    it('Choosing own destination works as it should', () => {
        // Checks if the home page is accessible and shows up as expected
        cy.intercept('POST', 'https://api.openai.com/v1/chat/completions').as('apiRequestChat')
        cy.intercept('GET', 'https://travel-advisor-seven-mu.vercel.app/api/location/**').as('apiRequestTravel')
        cy.visit('http://localhost:5173/group10-finalproject/')
        cy.getDataTest('Website-Name').should('contain.text', 'TRAVEL ADVISOR')

        // Checks if next button is clickable if no choice is chosen
        cy.getDataTest('Start-Button').click()
        cy.getDataTest('Next-Button-AiRec').should('be.disabled')
        cy.getDataTest('Choose-Own-Button').click()
        cy.getDataTest('Next-Button-AiRec').should('be.enabled')
        cy.getDataTest('Next-Button-AiRec').click()

        // Checks to see if users can continue if no information is inputted
        cy.getDataTest('Next-Button-Des').should('be.disabled')
        cy.getDataTest('Country-Input').type('Mexico')
        cy.getDataTest('Next-Button-Des').should('be.disabled')
        cy.getDataTest('City-Input').type('Mexico City')
        cy.getDataTest('Next-Button-Des').should('be.enabled')
        cy.getDataTest('Next-Button-Des').click()

        // Checks to see if picking the start date works like expected         
        cy.getDataTest('Next-Button-Cal').should('be.disabled')
        cy.getDataTest('Calender-Button').click()
        const today = new Date().getDate()
        for (let i = 1; i < today; i++) {
            cy.getDataTest(`Date-${i}`).should('be.disabled')
        }
        cy.getDataTest('Previous-Month').click()
        cy.getDataTest('Next-Month').click().click()
        cy.getDataTest('Date-27').click()
        cy.getDataTest('Next-Button-Cal').should('be.enabled')
        cy.getDataTest('Next-Button-Cal').click()

        // Checks to see if picking the end date works like expected
        cy.getDataTest('Next-Button-Cal').should('be.disabled')
        cy.getDataTest('Calender-Button').click()
        cy.getDataTest('Next-Month').click()
        for (let i = 1; i < 27; i++) {
            cy.getDataTest(`Date-${i}`).should('be.disabled')
        }
        cy.getDataTest('Next-Month').click()
        cy.getDataTest('Date-26').click()
        cy.getDataTest('Trip-Duration').should('contain.text', 'Trip duration: 31 days')
        cy.getDataTest('Next-Button-Cal').click()
        
        // Checks if all the information is recieved and correct
        cy.wait('@apiRequestChat').its('response.statusCode').should('eq', 200)
        cy.wait('@apiRequestTravel').its('response.statusCode').should('eq', 200)
        cy.getDataTest('Results-Text').should('contain.text', 'YOUR DESIRED DESTINATION AWAITS')
        cy.getDataTest('Travel-Date').should('contain.text', 'May 27, 2025 - Jun 26, 2025')
        cy.getDataTest('Travel-Duration').should('contain.text', '31 days')
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
        for (let i = 1; i < 32; i++) {
            cy.getDataTest(`Day-${i}`).should('contain.text', `Day ${i}`);
        }        
        cy.getDataTest('Another-Itinerary').should('be.enabled')
        cy.getDataTest('Another-Itinerary').click()
        cy.wait('@apiRequestChat', { timeout: 60000 }).its('response.statusCode').should('eq', 200)
        for (let i = 1; i < 32; i++) {
            cy.getDataTest(`Day-${i}`).should('contain.text', `Day ${i}`);
        }

        // Checks if the back button works
        cy.getDataTest('Results-Back').click()
        cy.getDataTest('End-Date-Back').click()
        cy.getDataTest('Start-Date-Back').click()
        cy.getDataTest('Back-Button-Des').click()
        cy.getDataTest('Next-Button-AiRec').should('be.disabled')
        cy.getDataTest('AiRec-Back').click()

        // Checks to see if all the information is still there
        cy.getDataTest('Start-Button').click()
        cy.getDataTest('Choose-Own-Button').click()
        cy.getDataTest('Next-Button-AiRec').click()
        cy.getDataTest('Next-Button-Des').click()
        cy.getDataTest('Next-Button-Cal').click()
        cy.getDataTest('Next-Button-Cal').click()

        // Checks to see if the start over button works as intended
        cy.getDataTest('Start-Over').click()
        cy.getDataTest('Start-Button').click()
        cy.getDataTest('Choose-Own-Button').click()
        cy.getDataTest('Next-Button-AiRec').click()
        cy.getDataTest('Country-Input').should('have.value', '')
        cy.getDataTest('City-Input').should('have.value', '')
        cy.getDataTest('Next-Button-Des').should('be.disabled')
    })
})
