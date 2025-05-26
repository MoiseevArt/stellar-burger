import { createSlice, nanoid, PayloadAction } from '@reduxjs/toolkit';
import { TIngredient, TConstructorIngredient } from '../../utils/types';

type TBurgerConstructorState = {
  bun: TConstructorIngredient | null;
  ingredients: TConstructorIngredient[];
};

export const initialState: TBurgerConstructorState = {
  bun: null,
  ingredients: []
};

const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addConstructorItem: {
      prepare: (ingredient: TIngredient) => {
        const newIngredient: TConstructorIngredient = {
          ...ingredient,
          id: nanoid()
        };
        return { payload: newIngredient };
      },
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        const ingredient = action.payload;

        if (ingredient.type === 'bun') {
          state.bun = ingredient;
        } else {
          state.ingredients.push(ingredient);
        }
      }
    },
    removeConstructorItem: (state, action: PayloadAction<string>) => {
      state.ingredients = state.ingredients.filter(
        (ingredient) => ingredient.id !== action.payload
      );
    },
    moveConstructorItem: (
      state,
      action: PayloadAction<{ index: number; move: 'up' | 'down' }>
    ) => {
      const { index, move } = action.payload;

      if (move === 'up' && index > 0) {
        [state.ingredients[index], state.ingredients[index - 1]] = [
          state.ingredients[index - 1],
          state.ingredients[index]
        ];
      } else if (move === 'down' && index < state.ingredients.length - 1) {
        [state.ingredients[index], state.ingredients[index + 1]] = [
          state.ingredients[index + 1],
          state.ingredients[index]
        ];
      }
    },
    clearConstructor: (state) => (state = initialState)
  },
  selectors: {
    getBurgerConstructorSelector: (state) => state,
    getIngredientsQuantitySelector: (state) => {
      const quantities: { [key: string]: number } = {};
      const { bun, ingredients } = state;
      if (bun) {
        quantities[bun._id] = (quantities[bun._id] || 0) + 2;
      }

      ingredients.forEach((ingredient) => {
        quantities[ingredient._id] = (quantities[ingredient._id] || 0) + 1;
      });

      return quantities;
    }
  }
});

export const constructorReducer = burgerConstructorSlice.reducer;
export const { getBurgerConstructorSelector, getIngredientsQuantitySelector } =
  burgerConstructorSlice.selectors;
export const {
  addConstructorItem,
  removeConstructorItem,
  moveConstructorItem,
  clearConstructor
} = burgerConstructorSlice.actions;
