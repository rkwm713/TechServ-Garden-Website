const { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'default',
  service: 'techserv-garden-website',
  location: 'us-south1'
};
exports.connectorConfig = connectorConfig;

exports.upsertUserProfileRef = function upsertUserProfileRef(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpsertUserProfile', inputVars);
}
exports.upsertUserProfile = function upsertUserProfile(dcOrVars, vars) {
  return executeMutation(upsertUserProfileRef(dcOrVars, vars));
};
exports.updateUserRoleRef = function updateUserRoleRef(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateUserRole', inputVars);
}
exports.updateUserRole = function updateUserRole(dcOrVars, vars) {
  return executeMutation(updateUserRoleRef(dcOrVars, vars));
};
exports.createPlotRef = function createPlotRef(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreatePlot', inputVars);
}
exports.createPlot = function createPlot(dcOrVars, vars) {
  return executeMutation(createPlotRef(dcOrVars, vars));
};
exports.updatePlotRef = function updatePlotRef(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdatePlot', inputVars);
}
exports.updatePlot = function updatePlot(dcOrVars, vars) {
  return executeMutation(updatePlotRef(dcOrVars, vars));
};
exports.assignPlotRef = function assignPlotRef(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AssignPlot', inputVars);
}
exports.assignPlot = function assignPlot(dcOrVars, vars) {
  return executeMutation(assignPlotRef(dcOrVars, vars));
};
exports.waterPlotRef = function waterPlotRef(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'WaterPlot', inputVars);
}
exports.waterPlot = function waterPlot(dcOrVars, vars) {
  return executeMutation(waterPlotRef(dcOrVars, vars));
};
exports.addPlantRef = function addPlantRef(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AddPlant', inputVars);
}
exports.addPlant = function addPlant(dcOrVars, vars) {
  return executeMutation(addPlantRef(dcOrVars, vars));
};
exports.updatePlantRef = function updatePlantRef(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdatePlant', inputVars);
}
exports.updatePlant = function updatePlant(dcOrVars, vars) {
  return executeMutation(updatePlantRef(dcOrVars, vars));
};
exports.plantInPlotRef = function plantInPlotRef(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'PlantInPlot', inputVars);
}
exports.plantInPlot = function plantInPlot(dcOrVars, vars) {
  return executeMutation(plantInPlotRef(dcOrVars, vars));
};
exports.updatePlantStatusRef = function updatePlantStatusRef(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdatePlantStatus', inputVars);
}
exports.updatePlantStatus = function updatePlantStatus(dcOrVars, vars) {
  return executeMutation(updatePlantStatusRef(dcOrVars, vars));
};
exports.removePlantRef = function removePlantRef(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'RemovePlant', inputVars);
}
exports.removePlant = function removePlant(dcOrVars, vars) {
  return executeMutation(removePlantRef(dcOrVars, vars));
};
exports.createTaskRef = function createTaskRef(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateTask', inputVars);
}
exports.createTask = function createTask(dcOrVars, vars) {
  return executeMutation(createTaskRef(dcOrVars, vars));
};
exports.updateTaskRef = function updateTaskRef(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateTask', inputVars);
}
exports.updateTask = function updateTask(dcOrVars, vars) {
  return executeMutation(updateTaskRef(dcOrVars, vars));
};
exports.completeTaskRef = function completeTaskRef(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CompleteTask', inputVars);
}
exports.completeTask = function completeTask(dcOrVars, vars) {
  return executeMutation(completeTaskRef(dcOrVars, vars));
};
exports.deleteTaskRef = function deleteTaskRef(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteTask', inputVars);
}
exports.deleteTask = function deleteTask(dcOrVars, vars) {
  return executeMutation(deleteTaskRef(dcOrVars, vars));
};
exports.createEventRef = function createEventRef(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateEvent', inputVars);
}
exports.createEvent = function createEvent(dcOrVars, vars) {
  return executeMutation(createEventRef(dcOrVars, vars));
};
exports.updateEventRef = function updateEventRef(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateEvent', inputVars);
}
exports.updateEvent = function updateEvent(dcOrVars, vars) {
  return executeMutation(updateEventRef(dcOrVars, vars));
};
exports.rsvpToEventRef = function rsvpToEventRef(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'RsvpToEvent', inputVars);
}
exports.rsvpToEvent = function rsvpToEvent(dcOrVars, vars) {
  return executeMutation(rsvpToEventRef(dcOrVars, vars));
};
exports.cancelEventRef = function cancelEventRef(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CancelEvent', inputVars);
}
exports.cancelEvent = function cancelEvent(dcOrVars, vars) {
  return executeMutation(cancelEventRef(dcOrVars, vars));
};
exports.createResourceRef = function createResourceRef(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateResource', inputVars);
}
exports.createResource = function createResource(dcOrVars, vars) {
  return executeMutation(createResourceRef(dcOrVars, vars));
};
exports.updateResourceRef = function updateResourceRef(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateResource', inputVars);
}
exports.updateResource = function updateResource(dcOrVars, vars) {
  return executeMutation(updateResourceRef(dcOrVars, vars));
};
exports.deleteResourceRef = function deleteResourceRef(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteResource', inputVars);
}
exports.deleteResource = function deleteResource(dcOrVars, vars) {
  return executeMutation(deleteResourceRef(dcOrVars, vars));
};
exports.recordWeatherRef = function recordWeatherRef(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'RecordWeather', inputVars);
}
exports.recordWeather = function recordWeather(dcOrVars, vars) {
  return executeMutation(recordWeatherRef(dcOrVars, vars));
};
exports.getCurrentUserRef = function getCurrentUserRef(dc) {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetCurrentUser');
}
exports.getCurrentUser = function getCurrentUser(dc) {
  return executeQuery(getCurrentUserRef(dc));
};
exports.listGardenPlotsRef = function listGardenPlotsRef(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListGardenPlots', inputVars);
}
exports.listGardenPlots = function listGardenPlots(dcOrVars, vars) {
  return executeQuery(listGardenPlotsRef(dcOrVars, vars));
};
exports.getPlotDetailsRef = function getPlotDetailsRef(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetPlotDetails', inputVars);
}
exports.getPlotDetails = function getPlotDetails(dcOrVars, vars) {
  return executeQuery(getPlotDetailsRef(dcOrVars, vars));
};
exports.listPlantsRef = function listPlantsRef(dc) {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListPlants');
}
exports.listPlants = function listPlants(dc) {
  return executeQuery(listPlantsRef(dc));
};
exports.searchPlantsRef = function searchPlantsRef(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'SearchPlants', inputVars);
}
exports.searchPlants = function searchPlants(dcOrVars, vars) {
  return executeQuery(searchPlantsRef(dcOrVars, vars));
};
exports.listTasksRef = function listTasksRef(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListTasks', inputVars);
}
exports.listTasks = function listTasks(dcOrVars, vars) {
  return executeQuery(listTasksRef(dcOrVars, vars));
};
exports.getMyTasksRef = function getMyTasksRef(dc) {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetMyTasks');
}
exports.getMyTasks = function getMyTasks(dc) {
  return executeQuery(getMyTasksRef(dc));
};
exports.listUpcomingEventsRef = function listUpcomingEventsRef(dc) {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListUpcomingEvents');
}
exports.listUpcomingEvents = function listUpcomingEvents(dc) {
  return executeQuery(listUpcomingEventsRef(dc));
};
exports.getEventDetailsRef = function getEventDetailsRef(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetEventDetails', inputVars);
}
exports.getEventDetails = function getEventDetails(dcOrVars, vars) {
  return executeQuery(getEventDetailsRef(dcOrVars, vars));
};
exports.listResourcesRef = function listResourcesRef(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListResources', inputVars);
}
exports.listResources = function listResources(dcOrVars, vars) {
  return executeQuery(listResourcesRef(dcOrVars, vars));
};
exports.getResourceDetailsRef = function getResourceDetailsRef(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetResourceDetails', inputVars);
}
exports.getResourceDetails = function getResourceDetails(dcOrVars, vars) {
  return executeQuery(getResourceDetailsRef(dcOrVars, vars));
};
exports.getRecentWeatherRef = function getRecentWeatherRef(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetRecentWeather', inputVars);
}
exports.getRecentWeather = function getRecentWeather(dcOrVars, vars) {
  return executeQuery(getRecentWeatherRef(dcOrVars, vars));
};
