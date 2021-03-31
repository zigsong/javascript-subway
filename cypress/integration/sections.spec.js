describe('지하철 구간 관리 테스트', () => {
  const requestURL = 'https://www.boorownie.com';
  const userEmail = 'sunny@email.com';
  const password = 'sunny';

  beforeEach(() => {
    cy.visit('http://localhost:8080/');

    cy.intercept('POST', `${requestURL}/login/token`).as('login');
    cy.intercept('GET', `${requestURL}/members/me`).as('userInfo');
    cy.intercept('GET', `${requestURL}/stations`).as('getStations');
    cy.intercept('GET', `${requestURL}/lines`).as('getLines');

    cy.get('#login-nav-button').click();

    cy.get('#email').type(userEmail);
    cy.get('#password').type(password);

    cy.get('#login-submit').click();
    cy.wait('@login');
    cy.wait('@userInfo');

    cy.wait('@getStations');
    cy.wait('@getLines');
    cy.get('#sections-nav-button').click();
  });

  it('새로운 구간을 등록할 수 있다.', () => {
    const targetLine = '테스트';
    const upStation = '역2';
    const downStation = '역3';
    const duration = '10';
    const distance = '10';

    cy.intercept('POST', `${requestURL}/lines`).as('addSection');

    cy.get('#add-section-btn').click();
    cy.get('.modal').should('be.visible');
    cy.get('#subway-line-for-section').select(targetLine);
    cy.get('#up-station').select(upStation);
    cy.get('#down-station').select(downStation);
    cy.get('#distance').type(distance);
    cy.get('#duration').type(duration);

    cy.get('#subway-section-form').submit();

    cy.wait('@addSection');

    cy.get('.modal').should('not.be.visible');
    cy.get('.station-list-item').last().find('.station-item-name').should('have.text', downStation);
  });
});
