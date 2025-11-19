import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface FiltersState {
  searchText: string;
  city: string; 
  skills: string[];
}

const initialState: FiltersState = {
  searchText: '',
  city: 'all',
  skills: ['TypeScript', 'React', 'Redux'], 
};

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setSearchText(state, action: PayloadAction<string>) {
      state.searchText = action.payload;
    },
    setCity(state, action: PayloadAction<string>) {
      state.city = action.payload;
    },
    addSkill(state, action: PayloadAction<string>) {
      if (!state.skills.includes(action.payload)) {
        state.skills.push(action.payload);
      }
    },
    removeSkill(state, action: PayloadAction<string>) {
      state.skills = state.skills.filter((skill) => skill !== action.payload);
    },
  },
});

export const { setSearchText, setCity, addSkill, removeSkill } = filtersSlice.actions;
export default filtersSlice.reducer;
