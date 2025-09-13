'use client';

import { useState, useEffect } from 'react';

interface TeamMember {
  id: string;
  name: string;
  position: string;
  avatar_url?: string;
  description?: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface UseTeamMembersReturn {
  teamMembers: TeamMember[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useTeamMembers(): UseTeamMembersReturn {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTeamMembers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/team');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        setTeamMembers(result.data || []);
      } else {
        throw new Error(result.error || 'Failed to fetch team members');
      }
    } catch (error) {
      console.error('Error fetching team members:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
      setTeamMembers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  return {
    teamMembers,
    loading,
    error,
    refetch: fetchTeamMembers
  };
}