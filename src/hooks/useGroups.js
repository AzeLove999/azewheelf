import { useState, useEffect, useCallback, useMemo } from 'react';

export function useGroups() {
  const [groupsData, setGroupsData] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState('');
  const [excluded, setExcluded] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch groups from JSON
  useEffect(() => {
    setLoading(true);
    fetch('/data/groups.json')
      .then(res => {
        if (!res.ok) throw new Error('Failed to load groups');
        return res.json();
      })
      .then(data => {
        setGroupsData(data);
        if (data.groups && data.groups.length > 0) {
          setSelectedGroup(data.groups[0].name);
        }
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Get list of group names
  const groupNames = useMemo(() => {
    if (!groupsData?.groups) return [];
    return groupsData.groups.map(g => g.name);
  }, [groupsData]);

  // Get students for the selected group, excluding excluded IDs
  const activeStudents = useMemo(() => {
    if (!groupsData?.groups || !selectedGroup) return [];
    const group = groupsData.groups.find(g => g.name === selectedGroup);
    if (!group) return [];
    return group.items.filter(s => !excluded.has(s.id));
  }, [groupsData, selectedGroup, excluded]);

  // All students in the selected group (including excluded)
  const allStudents = useMemo(() => {
    if (!groupsData?.groups || !selectedGroup) return [];
    const group = groupsData.groups.find(g => g.name === selectedGroup);
    return group ? group.items : [];
  }, [groupsData, selectedGroup]);

  const excludeStudent = useCallback((id) => {
    setExcluded(prev => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }, []);

  const resetExclusions = useCallback(() => {
    setExcluded(new Set());
  }, []);

  const toggleExclusion = useCallback((id) => {
    setExcluded(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  return {
    groupNames,
    selectedGroup,
    setSelectedGroup,
    activeStudents,
    allStudents,
    excluded,
    excludeStudent,
    resetExclusions,
    toggleExclusion,
    loading,
    error,
  };
}
