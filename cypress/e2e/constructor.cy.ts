describe('Проверка функциональности', () => {

    it('Доступность по адресу: localhost:4000', () => {
        cy.visit('');
    });

    function cypressAttribute (name: string) {
        return `[data-cy="${name}"]`
    };

    beforeEach(() => {
        cy.intercept('GET', 'api/ingredients', (req) => {
            req.reply({
                fixture: 'getIngredients.json'
            });
        }).as('getIngredients');

        cy.intercept('GET', 'api/auth/user', {
            fixture: 'user.json'
        }).as('getUser');

        cy.intercept('POST', 'api/orders', {
            fixture: 'createOrder.json'
        }).as('postOrders');

        cy.setCookie('accessToken', 'mockAccessToken');
        localStorage.setItem('refreshToken', 'mockRefreshToken');

        cy.visit('');
    });

    afterEach(() => {
        cy.setCookie('accessToken', '');
        localStorage.setItem('refreshToken', '');
    });


    describe("Тестирование работы модальных окон", () => {
        beforeEach(() => {
            cy.get(cypressAttribute('ingredients-category')).find('li').first().click();
        });

        it('Открытие модального окна ингредиента', () => {
            cy.get(cypressAttribute('modal')).should('be.visible');
            cy.contains('Детали ингридиента').should('exist');
        });

        describe("close modal tests:", () => {
            it('close button', () => {
                cy.get(cypressAttribute('close-button')).click();
                cy.get(cypressAttribute('modal')).should('not.exist');
            });
            it('esc', () => {
                cy.get('body').type('{esc}');
                cy.get(cypressAttribute('modal')).should('not.exist');
            });
        });

        it('Открытие описания модального окна', () => {
            cy.get(cypressAttribute('close-button')).should('exist');
            cy.get(cypressAttribute('ingredient-image')).should('be.visible');
            cy.get(cypressAttribute('ingredient-name')).should('not.be.empty')
            cy.get('li').children('p').contains('Калории, ккал').next('p').should('not.be.empty');
            cy.get('li').children('p').contains('Белки, г').next('p').should('not.be.empty');
            cy.get('li').children('p').contains('Жиры, г').next('p').should('not.be.empty');
            cy.get('li').children('p').contains('Углеводы, г').next('p').should('not.be.empty');
        });
    });


    describe('Создание заказа', () => {
        describe('Добавление ингредиентов в конструктор бургера', () => {
            it('Добавление булки (bun)', () => {
                const btnAddBun = cy.get('h3').contains('Булки').next('ul').contains('Добавить');
                btnAddBun.click();
                cy.get('div').contains('Выберите булки').should('not.exist');
            });

            it('Добавление ингредиентов', () => {
                const btnAddMain = cy.get('h3').contains('Начинки').next('ul').contains('Добавить');
                const btnAddSauce = cy.get('h3').contains('Соусы').next('ul').contains('Добавить');
                btnAddMain.click();
                btnAddSauce.click();
                cy.get('div').contains('Выберите начинку').should('not.exist');
            });
        });

        it('Наличие пользователя', () => {
            cy.contains('qwerty').should('exist');
        });

        it('Оформление заказа', () => {

            const btnAddBun = cy.get('h3').contains('Булки').next('ul').contains('Добавить');
            const btnAddMain = cy.get('h3').contains('Начинки').next('ul').contains('Добавить');
            const btnAddSauce = cy.get('h3').contains('Соусы').next('ul').contains('Добавить');
            btnAddBun.click();
            btnAddMain.click();
            btnAddSauce.click();
            const btnMakeOrder = cy.contains('Оформить заказ');
            btnMakeOrder.click();

            cy.contains('12345').should('exist');

            cy.get(cypressAttribute('close-button')).click();
            cy.get(cypressAttribute('modal')).should('not.exist');
            cy.contains('12345').should('not.exist');

            cy.contains('Выберите булки').should('exist');
            cy.contains('Выберите начинку').should('exist');
        });
    });
});