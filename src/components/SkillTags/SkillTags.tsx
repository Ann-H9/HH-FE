import { useState } from 'react';
import { 
  TextInput, 
  ActionIcon, 
  Group, 
  Text, 
  Pill, 
  Stack 
} from '@mantine/core';
import { IconPlus } from '@tabler/icons-react'; 
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { addSkill, removeSkill } from '../../features/filters/filtersSlice';
import { getVacancies } from '../../features/vacancies/vacanciesSlice';

function SkillTags() {
  const dispatch = useAppDispatch();
  const skills = useAppSelector((state) => state.filters.skills);
  const [newSkill, setNewSkill] = useState('');

  const handleAdd = () => {
    const trimmed = newSkill.trim();
    if (trimmed) {
      dispatch(addSkill(trimmed));
      dispatch(getVacancies());
      setNewSkill('');
    }
  };

  const handleRemove = (skill: string) => {
    dispatch(removeSkill(skill));
    dispatch(getVacancies());
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleAdd();
    }
  };

  return (
    <Stack gap="xs" w="100%" maw={400}>
      <Text fw={600} size="sm">
        Ключевые навыки
      </Text>

     
      <Group gap="xs" align="center">
        <TextInput
          placeholder="Навык"
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          onKeyDown={handleKeyDown}
          style={{ flex: 1 }}
          radius="md"
        />
        <ActionIcon 
          onClick={handleAdd} 
          variant="filled" 
          color="blue" 
          size="lg"
          radius="md"
          aria-label="Добавить навык"
        >
          <IconPlus style={{ width: '70%', height: '70%' }} stroke={2} />
        </ActionIcon>
      </Group>

      
      <Group gap="xs">
        {skills.map((skill) => (
          <Pill
            key={skill}
            withRemoveButton
            onRemove={() => handleRemove(skill)}
            size="md"
            bg="gray.1" 
          >
            {skill}
          </Pill>
        ))}
      </Group>
    </Stack>
  );
}

export default SkillTags;