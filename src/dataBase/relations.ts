import { relations } from "drizzle-orm/relations";
import {
  financialReports,
  projectAssignments,
  projectCosts,
  projects,
  tasks,
  userCredentials,
  userProfiles,
  userRoles,
  users,
  vacations,
  workLogs,
} from "@/dataBase/schema";

export const usersRelations = relations(users, ({ one, many }) => ({
  userRole: one(userRoles, {
    fields: [users.roleId],
    references: [userRoles.id],
  }),
  userCredentials: many(userCredentials),
  userProfiles_userId: many(userProfiles, {
    relationName: "userProfiles_userId_users_id",
  }),
  userProfiles_supervisorId: many(userProfiles, {
    relationName: "userProfiles_supervisorId_users_id",
  }),
  projectAssignments: many(projectAssignments),
  tasks: many(tasks),
  workLogs: many(workLogs),
  vacations: many(vacations),
}));

export const userRolesRelations = relations(userRoles, ({ many }) => ({
  users: many(users),
}));

export const userCredentialsRelations = relations(
  userCredentials,
  ({ one }) => ({
    user: one(users, {
      fields: [userCredentials.userId],
      references: [users.id],
    }),
  }),
);

export const userProfilesRelations = relations(userProfiles, ({ one }) => ({
  user_userId: one(users, {
    fields: [userProfiles.userId],
    references: [users.id],
    relationName: "userProfiles_userId_users_id",
  }),
  user_supervisorId: one(users, {
    fields: [userProfiles.supervisorId],
    references: [users.id],
    relationName: "userProfiles_supervisorId_users_id",
  }),
}));

export const projectAssignmentsRelations = relations(
  projectAssignments,
  ({ one }) => ({
    user: one(users, {
      fields: [projectAssignments.userId],
      references: [users.id],
    }),
    project: one(projects, {
      fields: [projectAssignments.projectId],
      references: [projects.id],
    }),
  }),
);

export const projectsRelations = relations(projects, ({ many }) => ({
  projectAssignments: many(projectAssignments),
  tasks: many(tasks),
  workLogs: many(workLogs),
  projectCosts: many(projectCosts),
  financialReports: many(financialReports),
}));

export const tasksRelations = relations(tasks, ({ one, many }) => ({
  project: one(projects, {
    fields: [tasks.projectId],
    references: [projects.id],
  }),
  user: one(users, {
    fields: [tasks.assignedToId],
    references: [users.id],
  }),
  workLogs: many(workLogs),
}));

export const workLogsRelations = relations(workLogs, ({ one }) => ({
  user: one(users, {
    fields: [workLogs.userId],
    references: [users.id],
  }),
  task: one(tasks, {
    fields: [workLogs.taskId],
    references: [tasks.id],
  }),
  project: one(projects, {
    fields: [workLogs.projectId],
    references: [projects.id],
  }),
}));

export const vacationsRelations = relations(vacations, ({ one }) => ({
  user: one(users, {
    fields: [vacations.userId],
    references: [users.id],
  }),
}));

export const projectCostsRelations = relations(projectCosts, ({ one }) => ({
  project: one(projects, {
    fields: [projectCosts.projectId],
    references: [projects.id],
  }),
}));

export const financialReportsRelations = relations(
  financialReports,
  ({ one }) => ({
    project: one(projects, {
      fields: [financialReports.projectId],
      references: [projects.id],
    }),
  }),
);
