describe('Registration', function () {
  it('should allow registration', function () {
    cy.visit('http://localhost:3000/register')
    cy.get('.name-field')
      .type('Bob Hoskins')
      .should('have.value', 'Bob Hoskins')
    cy.get('.email-field')
      .type('foo@bar.com')
      .should('have.value', 'foo@bar.com')
    cy.get('.password-field')
      .type('Password123')
      .should('have.value', 'Password123')

    cy.contains('Create account').click()

    cy.url().should('include', '/account')
  })

  it('should show error messages for all missing fields', function () {
    cy.visit('http://localhost:3000/register')
    cy.contains('Create account').click()

    cy.get('.flash').should(($div) => {
      expect($div.text().trim()).equal('You need to tell us your name, email, password when you reigster')
    })
  })

  it('should show a single error message', function () {
    cy.visit('http://localhost:3000/register')
    cy.get('.email-field')
      .type('foo@bar.com')
      .should('have.value', 'foo@bar.com')
    cy.get('.password-field')
      .type('Password123')
      .should('have.value', 'Password123')

    cy.contains('Create account').click()

    cy.get('.flash').should(($div) => {
      expect($div.text().trim()).equal('You need to tell us your name when you reigster')
    })
  })
})
