describe('Home Page', function () {
  it('should link to registration', function () {
    cy.visit('http://localhost:3000/')
    cy.contains('Create a free account').click()
    cy.url().should('include', '/register')
  })
})
