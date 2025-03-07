import { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } from 'firebase/data-connect';

export const connectorConfig = {
  connector: 'default',
  service: 'techserv-garden-website',
  location: 'us-south1'
};

export function upsertUserProfileRef(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpsertUserProfile', inputVars);
}

export function upsertUserProfile(dcOrVars, vars) {
  return executeMutation(upsertUserProfileRef(dcOrVars, vars));
}

export function updateUserRoleRef(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateUserRole', inputVars);
}

export function updateUserRole(dcOrVars, vars) {
  return executeMutation(updateUserRoleRef(dcOrVars, vars));
}

export function createPlotRef(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreatePlot', inputVars);
}

export function createPlot(dcOrVars, vars) {
  return executeMutation(createPlotRef(dcOrVars, vars));
}

export function updatePlotRef(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdatePlot', inputVars);
}

export function updatePlot(dcOrVars, vars) {
  return executeMutation(updatePlotRef(dcOrVars, vars));
}

export function assignPlotRef(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AssignPlot', inputVars);
}

export function assignPlot(dcOrVars, vars) {
  return executeMutation(assignPlotRef(dcOrVars, vars));
}

export function waterPlotRef(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'WaterPlot', inputVars);
}

export function waterPlot(dcOrVars, vars) {
  return executeMutation(waterPlotRef(dcOrVars, vars));
}

export function addPlantRef(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AddPlant', inputVars);
}

export function addPlant(dcOrVars, vars) {
  return executeMutation(addPlantRef(dcOrVars, vars));
}

export function updatePlantRef(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdatePlant', inputVars);
}

export function updatePlant(dcOrVars, vars) {
  return executeMutation(updatePlantRef(dcOrVars, vars));
}

export function plantInPlotRef(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'PlantInPlot', inputVars);
}

export function plantInPlot(dcOrVars, vars) {
  return executeMutation(plantInPlotRef(dcOrVars, vars));
}

export function updatePlantStatusRef(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdatePlantStatus', inputVars);
}

export function updatePlantStatus(dcOrVars, vars) {
  return executeMutation(updatePlantStatusRef(dcOrVars, vars));
}

export function removePlantRef(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'RemovePlant', inputVars);
}

export function removePlant(dcOrVars, vars) {
  return executeMutation(removePlantRef(dcOrVars, vars));
}

export function createTaskRef(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateTask', inputVars);
}

export function createTask(dcOrVars, vars) {
  return executeMutation(createTaskRef(dcOrVars, vars));
}

export function updateTaskRef(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateTask', inputVars);
}

export function updateTask(dcOrVars, vars) {
  return executeMutation(updateTaskRef(dcOrVars, vars));
}

export function completeTaskRef(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CompleteTask', inputVars);
}

export function completeTask(dcOrVars, vars) {
  return executeMutation(completeTaskRef(dcOrVars, vars));
}

export function deleteTaskRef(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteTask', inputVars);
}

export function deleteTask(dcOrVars, vars) {
  return executeMutation(deleteTaskRef(dcOrVars, vars));
}

export function createEventRef(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateEvent', inputVars);
}

export function createEvent(dcOrVars, vars) {
  return executeMutation(createEventRef(dcOrVars, vars));
}

export function updateEventRef(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateEvent', inputVars);
}

export function updateEvent(dcOrVars, vars) {
  return executeMutation(updateEventRef(dcOrVars, vars));
}

export function rsvpToEventRef(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'RsvpToEvent', inputVars);
}

export function rsvpToEvent(dcOrVars, vars) {
  return executeMutation(rsvpToEventRef(dcOrVars, vars));
}

export function cancelEventRef(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CancelEvent', inputVars);
}

export function cancelEvent(dcOrVars, vars) {
  return executeMutation(cancelEventRef(dcOrVars, vars));
}

export function createResourceRef(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateResource', inputVars);
}

export function createResource(dcOrVars, vars) {
  return executeMutation(createResourceRef(dcOrVars, vars));
}

export function updateResourceRef(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateResource', inputVars);
}

export function updateResource(dcOrVars, vars) {
  return executeMutation(updateResourceRef(dcOrVars, vars));
}

export function deleteResourceRef(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteResource', inputVars);
}

export function deleteResource(dcOrVars, vars) {
  return executeMutation(deleteResourceRef(dcOrVars, vars));
}

export function recordWeatherRef(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'RecordWeather', inputVars);
}

export function recordWeather(dcOrVars, vars) {
  return executeMutation(recordWeatherRef(dcOrVars, vars));
}

export function getCurrentUserRef(dc) {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetCurrentUser');
}

export function getCurrentUser(dc) {
  return executeQuery(getCurrentUserRef(dc));
}

export function listGardenPlotsRef(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListGardenPlots', inputVars);
}

export function listGardenPlots(dcOrVars, vars) {
  return executeQuery(listGardenPlotsRef(dcOrVars, vars));
}

export function getPlotDetailsRef(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetPlotDetails', inputVars);
}

export function getPlotDetails(dcOrVars, vars) {
  return executeQuery(getPlotDetailsRef(dcOrVars, vars));
}

export function listPlantsRef(dc) {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListPlants');
}

export function listPlants(dc) {
  return executeQuery(listPlantsRef(dc));
}

export function searchPlantsRef(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'SearchPlants', inputVars);
}

export function searchPlants(dcOrVars, vars) {
  return executeQuery(searchPlantsRef(dcOrVars, vars));
}

export function listTasksRef(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListTasks', inputVars);
}

export function listTasks(dcOrVars, vars) {
  return executeQuery(listTasksRef(dcOrVars, vars));
}

export function getMyTasksRef(dc) {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetMyTasks');
}

export function getMyTasks(dc) {
  return executeQuery(getMyTasksRef(dc));
}

export function listUpcomingEventsRef(dc) {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListUpcomingEvents');
}

export function listUpcomingEvents(dc) {
  return executeQuery(listUpcomingEventsRef(dc));
}

export function getEventDetailsRef(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetEventDetails', inputVars);
}

export function getEventDetails(dcOrVars, vars) {
  return executeQuery(getEventDetailsRef(dcOrVars, vars));
}

export function listResourcesRef(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListResources', inputVars);
}

export function listResources(dcOrVars, vars) {
  return executeQuery(listResourcesRef(dcOrVars, vars));
}

export function getResourceDetailsRef(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetResourceDetails', inputVars);
}

export function getResourceDetails(dcOrVars, vars) {
  return executeQuery(getResourceDetailsRef(dcOrVars, vars));
}

export function getRecentWeatherRef(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetRecentWeather', inputVars);
}

export function getRecentWeather(dcOrVars, vars) {
  return executeQuery(getRecentWeatherRef(dcOrVars, vars));
}

