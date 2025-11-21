import { describe, it, expect } from 'vitest';
import filtersReducer, { 
  setSearchText, 
  setCity, 
  addSkill, 
  removeSkill 
} from './filtersSlice';

describe('filtersSlice', () => {
  const initialState = {
    searchText: '',
    city: 'all',
    skills: ['TypeScript', 'React', 'Redux'],
  };

  it('должен вернуть начальное состояние при инициализации', () => {
    expect(filtersReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('должен обрабатывать setSearchText', () => {
    const previousState = { ...initialState, searchText: '' };
    
    const nextState = filtersReducer(previousState, setSearchText('Frontend'));

    expect(nextState.searchText).toBe('Frontend');
  });

  it('должен обрабатывать setCity', () => {
    const previousState = { ...initialState, city: 'all' };
    
    const nextState = filtersReducer(previousState, setCity('Moscow'));

    expect(nextState.city).toBe('Moscow');
  });

  describe('skills logic', () => {
    it('addSkill: должен добавить новый навык', () => {
      const previousState = { ...initialState, skills: ['React'] };
      
      const nextState = filtersReducer(previousState, addSkill('Docker'));

      expect(nextState.skills).toHaveLength(2);
      expect(nextState.skills).toContain('Docker');
      expect(nextState.skills).toEqual(['React', 'Docker']);
    });

    it('addSkill: НЕ должен добавлять дубликаты', () => {
      const previousState = { ...initialState, skills: ['React'] };
      
      const nextState = filtersReducer(previousState, addSkill('React'));

      expect(nextState.skills).toHaveLength(1); 
      expect(nextState.skills).toEqual(['React']);
    });

    it('removeSkill: должен удалять существующий навык', () => {
      const previousState = { ...initialState, skills: ['A', 'B', 'C'] };
      
      const nextState = filtersReducer(previousState, removeSkill('B'));

      expect(nextState.skills).toHaveLength(2);
      expect(nextState.skills).not.toContain('B');
      expect(nextState.skills).toEqual(['A', 'C']);
    });

    it('removeSkill: ничего не делает, если навыка нет', () => {
      const previousState = { ...initialState, skills: ['A', 'B'] };
      
      const nextState = filtersReducer(previousState, removeSkill('Z'));

      expect(nextState.skills).toEqual(['A', 'B']);
    });
  });
});