describe('Chatbot Test', () => {
  it('The AI chatbot button works correctly', () => {
    cy.intercept('POST', 'https://api.openai.com/v1/chat/completions').as('apiRequest')
    cy.visit('http://localhost:5173/group10-finalproject/')
    cy.getDataTest('Website-Name').should('contain.text', 'TRAVEL ADVISOR')

    cy.contains(/Hi there! I'm your AI travel assistant. How can I help you plan your perfect trip today?/i).should('not.exist')
    cy.getDataTest('Chatbot-Button').click()
    cy.contains(/Hi there! I'm your AI travel assistant. How can I help you plan your perfect trip today?/i).should('be.visible')
    cy.getDataTest('Chatbot-Button').click()
    cy.contains(/Hi there! I'm your AI travel assistant. How can I help you plan your perfect trip today?/i).should('not.exist')
    cy.getDataTest('Chatbot-Button').click()

    cy.getDataTest('Question-Field').type('What are some of the best places to travel to in the summer time?')
    cy.getDataTest('').should('not.exist')
    cy.getDataTest('Send-Button').click()
    cy.wait('@apiRequest').its('response.statusCode').should('eq', 200)
    cy.getDataTest('').should('exist')

    cy.getDataTest('Question-Field').type('Where are the best places I can go visa free with a Canadian passport?{enter}')
    cy.wait('@apiRequest').its('response.statusCode').should('eq', 200)
    cy.getDataTest('').should('exist')
  })
})
