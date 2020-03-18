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

  it('should be on an admin page', function () {
    cy.contains('Super Secret Admin Panel').click()
    cy.url().should('include', '/admin')
  })

  it('should allow adding of dummy topups', function () {
    cy.visit('http://localhost:3000/admin')
    cy.get('#amount')
      .clear()
      .type('3')
      .should('have.value', '3')
    
    cy.contains('Add top-ups').click()
    cy.get('body').find('.top-upmobile').its('length').should('eq', 3)
  })

  it('should allow the payment of a subset topups on the page', function () {
    cy.visit('http://localhost:3000/admin')
    cy.get('#amount')
      .clear()
      .type('3')
      .should('have.value', '3')
    
    cy.contains('Add top-ups').click()
    cy.get('[type="checkbox"]').check()
    
    cy.contains('Batch refund selected').click()
    cy.wait(3000)
    cy.url().should('include', 'natwest')
  })

})
