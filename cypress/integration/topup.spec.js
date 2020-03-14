describe('Registration', function () {
  beforeEach(() => {
    cy.request('http://localhost:3000/clear?token=00000')

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

    cy.contains('Top-up account').click()
    cy.url().should('include', '/account/top-up')
  })

  it('should allow topping up', function () {
    cy.get('#amount')
      .type('22')
      .should('have.value', '22')
    cy.contains('Top-up with Banked :').click()
    cy.url().should('include', 'checkout.banked.com')
    cy.get('.iubenda-cs-close-btn').click()
    cy.contains('Mock Bank').click()
    cy.wait(500)
    cy.get('.loading__redirect-link').click()
    cy.wait(500)
    cy.contains('Authorise').click()

    cy.url().should('include', '/account')
    cy.contains('£22.00').should('be.visible')
  })

  it('should show an error if zero money is topped up', function () {
    cy.get('#amount')
      .type('0')
      .should('have.value', '0')
    cy.contains('Top-up with Banked :').click()
    cy.contains('You need to indicate a amount of money to top up greater than zero').should('be.visible')
  })
})
