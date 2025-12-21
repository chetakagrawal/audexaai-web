import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { projectsApi } from './projects';
import { apiRequest } from './core';

// Mock the core apiRequest function
vi.mock('./core', () => ({
  apiRequest: vi.fn(),
}));

describe('projectsApi - Project Control Applications', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('listProjectControlApplications', () => {
    it('should fetch scoped applications for a project control', async () => {
      const mockProjectControlId = 'pc-123';
      const mockResponse = [
        {
          id: 'pca-1',
          tenant_id: 'tenant-1',
          project_control_id: 'pc-123',
          application_id: 'app-1',
          application_version_num: 1,
          source: 'manual',
          added_at: '2024-01-01T00:00:00Z',
          added_by_membership_id: 'member-1',
          removed_at: null,
          removed_by_membership_id: null,
          application: {
            id: 'app-1',
            tenant_id: 'tenant-1',
            name: 'Salesforce',
            category: 'CRM',
            scope_rationale: null,
            business_owner_membership_id: null,
            it_owner_membership_id: null,
            created_at: '2024-01-01T00:00:00Z',
          },
        },
      ];

      (apiRequest as any).mockResolvedValue(mockResponse);

      const result = await projectsApi.listProjectControlApplications(mockProjectControlId);

      expect(apiRequest).toHaveBeenCalledWith(
        `/v1/project-controls/${mockProjectControlId}/applications`
      );
      expect(result).toEqual(mockResponse);
    });

    it('should return empty array when no applications are scoped', async () => {
      (apiRequest as any).mockResolvedValue([]);

      const result = await projectsApi.listProjectControlApplications('pc-123');

      expect(result).toEqual([]);
    });

    it('should handle API errors', async () => {
      const mockError = new Error('Network error');
      (apiRequest as any).mockRejectedValue(mockError);

      await expect(projectsApi.listProjectControlApplications('pc-123')).rejects.toThrow(
        'Network error'
      );
    });
  });

  describe('addApplicationToProjectControl', () => {
    it('should add an application to a project control', async () => {
      const mockProjectControlId = 'pc-123';
      const mockApplicationId = 'app-1';
      const mockResponse = {
        id: 'pca-1',
        tenant_id: 'tenant-1',
        project_control_id: 'pc-123',
        application_id: 'app-1',
        application_version_num: 1,
        source: 'manual',
        added_at: '2024-01-01T00:00:00Z',
        added_by_membership_id: 'member-1',
        removed_at: null,
        removed_by_membership_id: null,
      };

      (apiRequest as any).mockResolvedValue(mockResponse);

      const result = await projectsApi.addApplicationToProjectControl(mockProjectControlId, {
        application_id: mockApplicationId,
      });

      expect(apiRequest).toHaveBeenCalledWith(
        `/v1/project-controls/${mockProjectControlId}/applications`,
        {
          method: 'POST',
          body: JSON.stringify({ application_id: mockApplicationId }),
        }
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle duplicate application error', async () => {
      const mockError = new Error('Application already scoped to this control');
      (apiRequest as any).mockRejectedValue(mockError);

      await expect(
        projectsApi.addApplicationToProjectControl('pc-123', { application_id: 'app-1' })
      ).rejects.toThrow('Application already scoped to this control');
    });
  });

  describe('removeApplicationFromProjectControl', () => {
    it('should remove an application from a project control', async () => {
      const mockPcaId = 'pca-1';

      (apiRequest as any).mockResolvedValue(undefined);

      await projectsApi.removeApplicationFromProjectControl(mockPcaId);

      expect(apiRequest).toHaveBeenCalledWith(`/v1/project-control-applications/${mockPcaId}`, {
        method: 'DELETE',
      });
    });

    it('should handle already removed application gracefully', async () => {
      const mockError = new Error('Not found');
      (apiRequest as any).mockRejectedValue(mockError);

      await expect(projectsApi.removeApplicationFromProjectControl('pca-1')).rejects.toThrow(
        'Not found'
      );
    });
  });

  describe('Integration: Diff-based scoping', () => {
    it('should handle adding and removing applications in sequence', async () => {
      const projectControlId = 'pc-123';

      // Initial state: app-1 and app-2 are scoped
      const initialScoped = [
        {
          id: 'pca-1',
          application_id: 'app-1',
          application: { id: 'app-1', name: 'Salesforce' },
        },
        {
          id: 'pca-2',
          application_id: 'app-2',
          application: { id: 'app-2', name: 'QuickBooks' },
        },
      ];

      // New state: app-1 and app-3 should be scoped (remove app-2, add app-3)
      const newAppIds = ['app-1', 'app-3'];

      (apiRequest as any).mockResolvedValueOnce(initialScoped); // listProjectControlApplications

      const currentScoped = await projectsApi.listProjectControlApplications(projectControlId);
      const currentAppIds = new Set(currentScoped.map((pca: any) => pca.application_id));
      const newAppIdsSet = new Set(newAppIds);

      // Determine what to add and remove
      const toAdd = newAppIds.filter(id => !currentAppIds.has(id));
      const toRemove = currentScoped.filter((pca: any) => !newAppIdsSet.has(pca.application_id));

      expect(toAdd).toEqual(['app-3']);
      expect(toRemove).toHaveLength(1);
      expect(toRemove[0].id).toBe('pca-2');

      // Mock the add operation
      (apiRequest as any).mockResolvedValueOnce({
        id: 'pca-3',
        application_id: 'app-3',
      });

      await projectsApi.addApplicationToProjectControl(projectControlId, {
        application_id: 'app-3',
      });

      expect(apiRequest).toHaveBeenCalledWith(
        `/v1/project-controls/${projectControlId}/applications`,
        {
          method: 'POST',
          body: JSON.stringify({ application_id: 'app-3' }),
        }
      );

      // Mock the remove operation
      (apiRequest as any).mockResolvedValueOnce(undefined);

      await projectsApi.removeApplicationFromProjectControl('pca-2');

      expect(apiRequest).toHaveBeenCalledWith('/v1/project-control-applications/pca-2', {
        method: 'DELETE',
      });
    });

    it('should handle no changes scenario', async () => {
      const projectControlId = 'pc-123';

      const currentScoped = [
        { id: 'pca-1', application_id: 'app-1' },
        { id: 'pca-2', application_id: 'app-2' },
      ];

      const newAppIds = ['app-1', 'app-2']; // Same as current

      const currentAppIds = new Set(currentScoped.map((pca: any) => pca.application_id));
      const newAppIdsSet = new Set(newAppIds);

      const toAdd = newAppIds.filter(id => !currentAppIds.has(id));
      const toRemove = currentScoped.filter((pca: any) => !newAppIdsSet.has(pca.application_id));

      expect(toAdd).toEqual([]);
      expect(toRemove).toEqual([]);

      // No API calls should be made
    });
  });
});

