// eslint-disable-next-line
Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test
  return false
})

describe('Batch', function () {
  beforeEach(() => {
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
})
