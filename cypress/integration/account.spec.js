describe('Account page', function () {
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

  it('should show no topups in new account', function () {
    cy.contains("You haven't made any topups!").should('be.visible')
    cy.contains('£0.00').should('be.visible')
  })

  it('should welcome with the account name', function () {
    cy.get('#welcome-message').should(($div) => {
      expect($div.text().trim()).equal('Welcome, Bob Hoskins')
    })
  })

  it('should show the top-up button', function () {
    cy.contains('Top-up account').should('be.visible')
  })

  it('should show the demo notice', function () {
    cy.contains('This is a demo and does not involve real money').should('be.visible')
  })

  it('should show demo footer', function () {
    cy.contains('Banked.com top-up example, the source code is released under an MIT license').should('be.visible')
    cy.get('.footer-link').should('have.attr', 'href').and('include', 'github.com/banked/example-topup')
  })

  it('should allow logout', function () {
    cy.contains('Logout').click()
    cy.url().should('include', '/')
    cy.contains('Create a free account').should('be.visible')
    cy.visit('http://localhost:3000/account')
    cy.url().should('include', '/')
  })

  it('should have a header link that routes to /account', function () {
    cy.contains('Top-up account').click()
    cy.url().should('include', '/account/top-up')
    cy.contains('Topupify').click()
    cy.url().should('include', '/account/')
  })
})
