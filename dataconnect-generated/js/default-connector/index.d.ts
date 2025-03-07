import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, MutationRef, MutationPromise } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;


export interface AddPlantData {
  plant_insert: Plant_Key;
}

export interface AddPlantVariables {
  name: string;
  scientificName?: string | null;
  plantType: string;
  growingSeason?: string | null;
  sunRequirement?: string | null;
  waterRequirement?: string | null;
  daysToHarvest?: number | null;
  spacingInInches?: number | null;
  companions?: string | null;
  imageUrl?: string | null;
}

export interface AssignPlotData {
  plot_update?: Plot_Key | null;
}

export interface AssignPlotVariables {
  plotId: UUIDString;
  userId: string;
}

export interface CancelEventData {
  event_delete?: Event_Key | null;
}

export interface CancelEventVariables {
  eventId: UUIDString;
}

export interface CompleteTaskData {
  task_update?: Task_Key | null;
}

export interface CompleteTaskVariables {
  taskId: UUIDString;
}

export interface CreateEventData {
  event_insert: Event_Key;
}

export interface CreateEventVariables {
  title: string;
  description?: string | null;
  startTime: TimestampString;
  endTime: TimestampString;
  location?: string | null;
  eventType?: string | null;
  maxAttendees?: number | null;
}

export interface CreatePlotData {
  plot_insert: Plot_Key;
}

export interface CreatePlotVariables {
  plotNumber: string;
  sizeInSqFt?: number | null;
  location?: string | null;
  soilType?: string | null;
  sunExposure?: string | null;
}

export interface CreateResourceData {
  resource_insert: Resource_Key;
}

export interface CreateResourceVariables {
  title: string;
  content: string;
  category: string;
  tags?: string | null;
  imageUrl?: string | null;
}

export interface CreateTaskData {
  task_insert: Task_Key;
}

export interface CreateTaskVariables {
  title: string;
  description?: string | null;
  category?: string | null;
  priority?: string | null;
  dueDate?: DateString | null;
  assignedToId?: string | null;
  relatedPlotId?: UUIDString | null;
}

export interface DeleteResourceData {
  resource_delete?: Resource_Key | null;
}

export interface DeleteResourceVariables {
  resourceId: UUIDString;
}

export interface DeleteTaskData {
  task_delete?: Task_Key | null;
}

export interface DeleteTaskVariables {
  taskId: UUIDString;
}

export interface EventAttendee_Key {
  eventId: UUIDString;
  userId: string;
  __typename?: 'EventAttendee_Key';
}

export interface Event_Key {
  id: UUIDString;
  __typename?: 'Event_Key';
}

export interface GardenUser_Key {
  id: string;
  __typename?: 'GardenUser_Key';
}

export interface GetCurrentUserData {
  currentUser?: {
    id: string;
    displayName: string;
    email: string;
    photoURL?: string | null;
    role?: string | null;
    joinedDate: DateString;
    plots: ({
      id: UUIDString;
      plotNumber: string;
      sizeInSqFt?: number | null;
      location?: string | null;
      soilType?: string | null;
      sunExposure?: string | null;
      isActive: boolean;
      lastWatered?: DateString | null;
    } & Plot_Key)[];
  } & GardenUser_Key;
}

export interface GetEventDetailsData {
  event?: {
    id: UUIDString;
    title: string;
    description?: string | null;
    startTime: TimestampString;
    endTime: TimestampString;
    location?: string | null;
    eventType?: string | null;
    maxAttendees?: number | null;
    organizer?: {
      id: string;
      displayName: string;
    } & GardenUser_Key;
      attendees: ({
        user: {
          id: string;
          displayName: string;
        } & GardenUser_Key;
          rsvpStatus: string;
          rsvpDate: TimestampString;
      })[];
  } & Event_Key;
}

export interface GetEventDetailsVariables {
  eventId: UUIDString;
}

export interface GetMyTasksData {
  tasks: ({
    id: UUIDString;
    title: string;
    description?: string | null;
    category?: string | null;
    priority?: string | null;
    status?: string | null;
    dueDate?: DateString | null;
    relatedPlot?: {
      id: UUIDString;
      plotNumber: string;
    } & Plot_Key;
  } & Task_Key)[];
}

export interface GetPlotDetailsData {
  plot?: {
    id: UUIDString;
    plotNumber: string;
    sizeInSqFt?: number | null;
    location?: string | null;
    soilType?: string | null;
    sunExposure?: string | null;
    isActive: boolean;
    lastWatered?: DateString | null;
    assignedTo?: {
      id: string;
      displayName: string;
      email: string;
    } & GardenUser_Key;
      plants: ({
        id: UUIDString;
        plantedDate: DateString;
        expectedHarvestDate?: DateString | null;
        status?: string | null;
        notes?: string | null;
        plantType: {
          id: UUIDString;
          name: string;
          scientificName?: string | null;
          growingSeason?: string | null;
          daysToHarvest?: number | null;
          imageUrl?: string | null;
        } & Plant_Key;
      } & PlantInstance_Key)[];
  } & Plot_Key;
}

export interface GetPlotDetailsVariables {
  plotId: UUIDString;
}

export interface GetRecentWeatherData {
  weatherRecords: ({
    id: UUIDString;
    recordDate: DateString;
    temperature?: number | null;
    humidity?: number | null;
    rainfall?: number | null;
    notes?: string | null;
  } & WeatherRecord_Key)[];
}

export interface GetRecentWeatherVariables {
  days: number;
}

export interface GetResourceDetailsData {
  resource?: {
    id: UUIDString;
    title: string;
    content: string;
    category: string;
    tags?: string | null;
    createdAt: DateString;
    updatedAt?: DateString | null;
    imageUrl?: string | null;
    author?: {
      id: string;
      displayName: string;
    } & GardenUser_Key;
  } & Resource_Key;
}

export interface GetResourceDetailsVariables {
  resourceId: UUIDString;
}

export interface ListGardenPlotsData {
  plots: ({
    id: UUIDString;
    plotNumber: string;
    location?: string | null;
    sizeInSqFt?: number | null;
    sunExposure?: string | null;
    assignedTo?: {
      id: string;
      displayName: string;
    } & GardenUser_Key;
      isActive: boolean;
      lastWatered?: DateString | null;
  } & Plot_Key)[];
}

export interface ListGardenPlotsVariables {
  isActive?: boolean | null;
}

export interface ListPlantsData {
  plants: ({
    id: UUIDString;
    name: string;
    scientificName?: string | null;
    plantType?: string | null;
    growingSeason?: string | null;
    sunRequirement?: string | null;
    waterRequirement?: string | null;
    daysToHarvest?: number | null;
    spacingInInches?: number | null;
    companions?: string | null;
    imageUrl?: string | null;
  } & Plant_Key)[];
}

export interface ListResourcesData {
  resources: ({
    id: UUIDString;
    title: string;
    category: string;
    tags?: string | null;
    createdAt: DateString;
    imageUrl?: string | null;
    author?: {
      id: string;
      displayName: string;
    } & GardenUser_Key;
  } & Resource_Key)[];
}

export interface ListResourcesVariables {
  category?: string | null;
}

export interface ListTasksData {
  tasks: ({
    id: UUIDString;
    title: string;
    description?: string | null;
    category?: string | null;
    priority?: string | null;
    status?: string | null;
    dueDate?: DateString | null;
    createdAt: DateString;
    assignedTo?: {
      id: string;
      displayName: string;
    } & GardenUser_Key;
      relatedPlot?: {
        id: UUIDString;
        plotNumber: string;
      } & Plot_Key;
  } & Task_Key)[];
}

export interface ListTasksVariables {
  status?: string | null;
  category?: string | null;
}

export interface ListUpcomingEventsData {
  events: ({
    id: UUIDString;
    title: string;
    description?: string | null;
    startTime: TimestampString;
    endTime: TimestampString;
    location?: string | null;
    eventType?: string | null;
    maxAttendees?: number | null;
    organizer?: {
      id: string;
      displayName: string;
    } & GardenUser_Key;
  } & Event_Key)[];
}

export interface PlantInPlotData {
  plantInstance_insert: PlantInstance_Key;
}

export interface PlantInPlotVariables {
  plotId: UUIDString;
  plantId: UUIDString;
  expectedHarvestDate?: DateString | null;
  notes?: string | null;
}

export interface PlantInstance_Key {
  id: UUIDString;
  __typename?: 'PlantInstance_Key';
}

export interface Plant_Key {
  id: UUIDString;
  __typename?: 'Plant_Key';
}

export interface Plot_Key {
  id: UUIDString;
  __typename?: 'Plot_Key';
}

export interface RecordWeatherData {
  weatherRecord_insert: WeatherRecord_Key;
}

export interface RecordWeatherVariables {
  temperature?: number | null;
  humidity?: number | null;
  rainfall?: number | null;
  notes?: string | null;
}

export interface RemovePlantData {
  plantInstance_delete?: PlantInstance_Key | null;
}

export interface RemovePlantVariables {
  instanceId: UUIDString;
}

export interface Resource_Key {
  id: UUIDString;
  __typename?: 'Resource_Key';
}

export interface RsvpToEventData {
  eventAttendee_upsert: EventAttendee_Key;
}

export interface RsvpToEventVariables {
  eventId: UUIDString;
  status: string;
}

export interface SearchPlantsData {
  plants: ({
    id: UUIDString;
    name: string;
    scientificName?: string | null;
    plantType?: string | null;
    growingSeason?: string | null;
    imageUrl?: string | null;
  } & Plant_Key)[];
}

export interface SearchPlantsVariables {
  searchTerm: string;
}

export interface Task_Key {
  id: UUIDString;
  __typename?: 'Task_Key';
}

export interface UpdateEventData {
  event_update?: Event_Key | null;
}

export interface UpdateEventVariables {
  eventId: UUIDString;
  title?: string | null;
  description?: string | null;
  startTime?: TimestampString | null;
  endTime?: TimestampString | null;
  location?: string | null;
  eventType?: string | null;
  maxAttendees?: number | null;
}

export interface UpdatePlantData {
  plant_update?: Plant_Key | null;
}

export interface UpdatePlantStatusData {
  plantInstance_update?: PlantInstance_Key | null;
}

export interface UpdatePlantStatusVariables {
  instanceId: UUIDString;
  status: string;
  notes?: string | null;
}

export interface UpdatePlantVariables {
  plantId: UUIDString;
  name?: string | null;
  scientificName?: string | null;
  plantType?: string | null;
  growingSeason?: string | null;
  sunRequirement?: string | null;
  waterRequirement?: string | null;
  daysToHarvest?: number | null;
  spacingInInches?: number | null;
  companions?: string | null;
  imageUrl?: string | null;
}

export interface UpdatePlotData {
  plot_update?: Plot_Key | null;
}

export interface UpdatePlotVariables {
  plotId: UUIDString;
  plotNumber?: string | null;
  sizeInSqFt?: number | null;
  location?: string | null;
  soilType?: string | null;
  sunExposure?: string | null;
  isActive?: boolean | null;
}

export interface UpdateResourceData {
  resource_update?: Resource_Key | null;
}

export interface UpdateResourceVariables {
  resourceId: UUIDString;
  title?: string | null;
  content?: string | null;
  category?: string | null;
  tags?: string | null;
  imageUrl?: string | null;
}

export interface UpdateTaskData {
  task_update?: Task_Key | null;
}

export interface UpdateTaskVariables {
  taskId: UUIDString;
  title?: string | null;
  description?: string | null;
  category?: string | null;
  priority?: string | null;
  status?: string | null;
  dueDate?: DateString | null;
  assignedToId?: string | null;
  relatedPlotId?: UUIDString | null;
}

export interface UpdateUserRoleData {
  gardenUser_update?: GardenUser_Key | null;
}

export interface UpdateUserRoleVariables {
  userId: string;
  role: string;
}

export interface UpsertUserProfileData {
  gardenUser_upsert: GardenUser_Key;
}

export interface UpsertUserProfileVariables {
  displayName: string;
  email: string;
  photoURL?: string | null;
  role?: string | null;
}

export interface WaterPlotData {
  plot_update?: Plot_Key | null;
}

export interface WaterPlotVariables {
  plotId: UUIDString;
}

export interface WeatherRecord_Key {
  id: UUIDString;
  __typename?: 'WeatherRecord_Key';
}

/* Allow users to create refs without passing in DataConnect */
export function upsertUserProfileRef(vars: UpsertUserProfileVariables): MutationRef<UpsertUserProfileData, UpsertUserProfileVariables>;
/* Allow users to pass in custom DataConnect instances */
export function upsertUserProfileRef(dc: DataConnect, vars: UpsertUserProfileVariables): MutationRef<UpsertUserProfileData, UpsertUserProfileVariables>;

export function upsertUserProfile(vars: UpsertUserProfileVariables): MutationPromise<UpsertUserProfileData, UpsertUserProfileVariables>;
export function upsertUserProfile(dc: DataConnect, vars: UpsertUserProfileVariables): MutationPromise<UpsertUserProfileData, UpsertUserProfileVariables>;

/* Allow users to create refs without passing in DataConnect */
export function updateUserRoleRef(vars: UpdateUserRoleVariables): MutationRef<UpdateUserRoleData, UpdateUserRoleVariables>;
/* Allow users to pass in custom DataConnect instances */
export function updateUserRoleRef(dc: DataConnect, vars: UpdateUserRoleVariables): MutationRef<UpdateUserRoleData, UpdateUserRoleVariables>;

export function updateUserRole(vars: UpdateUserRoleVariables): MutationPromise<UpdateUserRoleData, UpdateUserRoleVariables>;
export function updateUserRole(dc: DataConnect, vars: UpdateUserRoleVariables): MutationPromise<UpdateUserRoleData, UpdateUserRoleVariables>;

/* Allow users to create refs without passing in DataConnect */
export function createPlotRef(vars: CreatePlotVariables): MutationRef<CreatePlotData, CreatePlotVariables>;
/* Allow users to pass in custom DataConnect instances */
export function createPlotRef(dc: DataConnect, vars: CreatePlotVariables): MutationRef<CreatePlotData, CreatePlotVariables>;

export function createPlot(vars: CreatePlotVariables): MutationPromise<CreatePlotData, CreatePlotVariables>;
export function createPlot(dc: DataConnect, vars: CreatePlotVariables): MutationPromise<CreatePlotData, CreatePlotVariables>;

/* Allow users to create refs without passing in DataConnect */
export function updatePlotRef(vars: UpdatePlotVariables): MutationRef<UpdatePlotData, UpdatePlotVariables>;
/* Allow users to pass in custom DataConnect instances */
export function updatePlotRef(dc: DataConnect, vars: UpdatePlotVariables): MutationRef<UpdatePlotData, UpdatePlotVariables>;

export function updatePlot(vars: UpdatePlotVariables): MutationPromise<UpdatePlotData, UpdatePlotVariables>;
export function updatePlot(dc: DataConnect, vars: UpdatePlotVariables): MutationPromise<UpdatePlotData, UpdatePlotVariables>;

/* Allow users to create refs without passing in DataConnect */
export function assignPlotRef(vars: AssignPlotVariables): MutationRef<AssignPlotData, AssignPlotVariables>;
/* Allow users to pass in custom DataConnect instances */
export function assignPlotRef(dc: DataConnect, vars: AssignPlotVariables): MutationRef<AssignPlotData, AssignPlotVariables>;

export function assignPlot(vars: AssignPlotVariables): MutationPromise<AssignPlotData, AssignPlotVariables>;
export function assignPlot(dc: DataConnect, vars: AssignPlotVariables): MutationPromise<AssignPlotData, AssignPlotVariables>;

/* Allow users to create refs without passing in DataConnect */
export function waterPlotRef(vars: WaterPlotVariables): MutationRef<WaterPlotData, WaterPlotVariables>;
/* Allow users to pass in custom DataConnect instances */
export function waterPlotRef(dc: DataConnect, vars: WaterPlotVariables): MutationRef<WaterPlotData, WaterPlotVariables>;

export function waterPlot(vars: WaterPlotVariables): MutationPromise<WaterPlotData, WaterPlotVariables>;
export function waterPlot(dc: DataConnect, vars: WaterPlotVariables): MutationPromise<WaterPlotData, WaterPlotVariables>;

/* Allow users to create refs without passing in DataConnect */
export function addPlantRef(vars: AddPlantVariables): MutationRef<AddPlantData, AddPlantVariables>;
/* Allow users to pass in custom DataConnect instances */
export function addPlantRef(dc: DataConnect, vars: AddPlantVariables): MutationRef<AddPlantData, AddPlantVariables>;

export function addPlant(vars: AddPlantVariables): MutationPromise<AddPlantData, AddPlantVariables>;
export function addPlant(dc: DataConnect, vars: AddPlantVariables): MutationPromise<AddPlantData, AddPlantVariables>;

/* Allow users to create refs without passing in DataConnect */
export function updatePlantRef(vars: UpdatePlantVariables): MutationRef<UpdatePlantData, UpdatePlantVariables>;
/* Allow users to pass in custom DataConnect instances */
export function updatePlantRef(dc: DataConnect, vars: UpdatePlantVariables): MutationRef<UpdatePlantData, UpdatePlantVariables>;

export function updatePlant(vars: UpdatePlantVariables): MutationPromise<UpdatePlantData, UpdatePlantVariables>;
export function updatePlant(dc: DataConnect, vars: UpdatePlantVariables): MutationPromise<UpdatePlantData, UpdatePlantVariables>;

/* Allow users to create refs without passing in DataConnect */
export function plantInPlotRef(vars: PlantInPlotVariables): MutationRef<PlantInPlotData, PlantInPlotVariables>;
/* Allow users to pass in custom DataConnect instances */
export function plantInPlotRef(dc: DataConnect, vars: PlantInPlotVariables): MutationRef<PlantInPlotData, PlantInPlotVariables>;

export function plantInPlot(vars: PlantInPlotVariables): MutationPromise<PlantInPlotData, PlantInPlotVariables>;
export function plantInPlot(dc: DataConnect, vars: PlantInPlotVariables): MutationPromise<PlantInPlotData, PlantInPlotVariables>;

/* Allow users to create refs without passing in DataConnect */
export function updatePlantStatusRef(vars: UpdatePlantStatusVariables): MutationRef<UpdatePlantStatusData, UpdatePlantStatusVariables>;
/* Allow users to pass in custom DataConnect instances */
export function updatePlantStatusRef(dc: DataConnect, vars: UpdatePlantStatusVariables): MutationRef<UpdatePlantStatusData, UpdatePlantStatusVariables>;

export function updatePlantStatus(vars: UpdatePlantStatusVariables): MutationPromise<UpdatePlantStatusData, UpdatePlantStatusVariables>;
export function updatePlantStatus(dc: DataConnect, vars: UpdatePlantStatusVariables): MutationPromise<UpdatePlantStatusData, UpdatePlantStatusVariables>;

/* Allow users to create refs without passing in DataConnect */
export function removePlantRef(vars: RemovePlantVariables): MutationRef<RemovePlantData, RemovePlantVariables>;
/* Allow users to pass in custom DataConnect instances */
export function removePlantRef(dc: DataConnect, vars: RemovePlantVariables): MutationRef<RemovePlantData, RemovePlantVariables>;

export function removePlant(vars: RemovePlantVariables): MutationPromise<RemovePlantData, RemovePlantVariables>;
export function removePlant(dc: DataConnect, vars: RemovePlantVariables): MutationPromise<RemovePlantData, RemovePlantVariables>;

/* Allow users to create refs without passing in DataConnect */
export function createTaskRef(vars: CreateTaskVariables): MutationRef<CreateTaskData, CreateTaskVariables>;
/* Allow users to pass in custom DataConnect instances */
export function createTaskRef(dc: DataConnect, vars: CreateTaskVariables): MutationRef<CreateTaskData, CreateTaskVariables>;

export function createTask(vars: CreateTaskVariables): MutationPromise<CreateTaskData, CreateTaskVariables>;
export function createTask(dc: DataConnect, vars: CreateTaskVariables): MutationPromise<CreateTaskData, CreateTaskVariables>;

/* Allow users to create refs without passing in DataConnect */
export function updateTaskRef(vars: UpdateTaskVariables): MutationRef<UpdateTaskData, UpdateTaskVariables>;
/* Allow users to pass in custom DataConnect instances */
export function updateTaskRef(dc: DataConnect, vars: UpdateTaskVariables): MutationRef<UpdateTaskData, UpdateTaskVariables>;

export function updateTask(vars: UpdateTaskVariables): MutationPromise<UpdateTaskData, UpdateTaskVariables>;
export function updateTask(dc: DataConnect, vars: UpdateTaskVariables): MutationPromise<UpdateTaskData, UpdateTaskVariables>;

/* Allow users to create refs without passing in DataConnect */
export function completeTaskRef(vars: CompleteTaskVariables): MutationRef<CompleteTaskData, CompleteTaskVariables>;
/* Allow users to pass in custom DataConnect instances */
export function completeTaskRef(dc: DataConnect, vars: CompleteTaskVariables): MutationRef<CompleteTaskData, CompleteTaskVariables>;

export function completeTask(vars: CompleteTaskVariables): MutationPromise<CompleteTaskData, CompleteTaskVariables>;
export function completeTask(dc: DataConnect, vars: CompleteTaskVariables): MutationPromise<CompleteTaskData, CompleteTaskVariables>;

/* Allow users to create refs without passing in DataConnect */
export function deleteTaskRef(vars: DeleteTaskVariables): MutationRef<DeleteTaskData, DeleteTaskVariables>;
/* Allow users to pass in custom DataConnect instances */
export function deleteTaskRef(dc: DataConnect, vars: DeleteTaskVariables): MutationRef<DeleteTaskData, DeleteTaskVariables>;

export function deleteTask(vars: DeleteTaskVariables): MutationPromise<DeleteTaskData, DeleteTaskVariables>;
export function deleteTask(dc: DataConnect, vars: DeleteTaskVariables): MutationPromise<DeleteTaskData, DeleteTaskVariables>;

/* Allow users to create refs without passing in DataConnect */
export function createEventRef(vars: CreateEventVariables): MutationRef<CreateEventData, CreateEventVariables>;
/* Allow users to pass in custom DataConnect instances */
export function createEventRef(dc: DataConnect, vars: CreateEventVariables): MutationRef<CreateEventData, CreateEventVariables>;

export function createEvent(vars: CreateEventVariables): MutationPromise<CreateEventData, CreateEventVariables>;
export function createEvent(dc: DataConnect, vars: CreateEventVariables): MutationPromise<CreateEventData, CreateEventVariables>;

/* Allow users to create refs without passing in DataConnect */
export function updateEventRef(vars: UpdateEventVariables): MutationRef<UpdateEventData, UpdateEventVariables>;
/* Allow users to pass in custom DataConnect instances */
export function updateEventRef(dc: DataConnect, vars: UpdateEventVariables): MutationRef<UpdateEventData, UpdateEventVariables>;

export function updateEvent(vars: UpdateEventVariables): MutationPromise<UpdateEventData, UpdateEventVariables>;
export function updateEvent(dc: DataConnect, vars: UpdateEventVariables): MutationPromise<UpdateEventData, UpdateEventVariables>;

/* Allow users to create refs without passing in DataConnect */
export function rsvpToEventRef(vars: RsvpToEventVariables): MutationRef<RsvpToEventData, RsvpToEventVariables>;
/* Allow users to pass in custom DataConnect instances */
export function rsvpToEventRef(dc: DataConnect, vars: RsvpToEventVariables): MutationRef<RsvpToEventData, RsvpToEventVariables>;

export function rsvpToEvent(vars: RsvpToEventVariables): MutationPromise<RsvpToEventData, RsvpToEventVariables>;
export function rsvpToEvent(dc: DataConnect, vars: RsvpToEventVariables): MutationPromise<RsvpToEventData, RsvpToEventVariables>;

/* Allow users to create refs without passing in DataConnect */
export function cancelEventRef(vars: CancelEventVariables): MutationRef<CancelEventData, CancelEventVariables>;
/* Allow users to pass in custom DataConnect instances */
export function cancelEventRef(dc: DataConnect, vars: CancelEventVariables): MutationRef<CancelEventData, CancelEventVariables>;

export function cancelEvent(vars: CancelEventVariables): MutationPromise<CancelEventData, CancelEventVariables>;
export function cancelEvent(dc: DataConnect, vars: CancelEventVariables): MutationPromise<CancelEventData, CancelEventVariables>;

/* Allow users to create refs without passing in DataConnect */
export function createResourceRef(vars: CreateResourceVariables): MutationRef<CreateResourceData, CreateResourceVariables>;
/* Allow users to pass in custom DataConnect instances */
export function createResourceRef(dc: DataConnect, vars: CreateResourceVariables): MutationRef<CreateResourceData, CreateResourceVariables>;

export function createResource(vars: CreateResourceVariables): MutationPromise<CreateResourceData, CreateResourceVariables>;
export function createResource(dc: DataConnect, vars: CreateResourceVariables): MutationPromise<CreateResourceData, CreateResourceVariables>;

/* Allow users to create refs without passing in DataConnect */
export function updateResourceRef(vars: UpdateResourceVariables): MutationRef<UpdateResourceData, UpdateResourceVariables>;
/* Allow users to pass in custom DataConnect instances */
export function updateResourceRef(dc: DataConnect, vars: UpdateResourceVariables): MutationRef<UpdateResourceData, UpdateResourceVariables>;

export function updateResource(vars: UpdateResourceVariables): MutationPromise<UpdateResourceData, UpdateResourceVariables>;
export function updateResource(dc: DataConnect, vars: UpdateResourceVariables): MutationPromise<UpdateResourceData, UpdateResourceVariables>;

/* Allow users to create refs without passing in DataConnect */
export function deleteResourceRef(vars: DeleteResourceVariables): MutationRef<DeleteResourceData, DeleteResourceVariables>;
/* Allow users to pass in custom DataConnect instances */
export function deleteResourceRef(dc: DataConnect, vars: DeleteResourceVariables): MutationRef<DeleteResourceData, DeleteResourceVariables>;

export function deleteResource(vars: DeleteResourceVariables): MutationPromise<DeleteResourceData, DeleteResourceVariables>;
export function deleteResource(dc: DataConnect, vars: DeleteResourceVariables): MutationPromise<DeleteResourceData, DeleteResourceVariables>;

/* Allow users to create refs without passing in DataConnect */
export function recordWeatherRef(vars?: RecordWeatherVariables): MutationRef<RecordWeatherData, RecordWeatherVariables>;
/* Allow users to pass in custom DataConnect instances */
export function recordWeatherRef(dc: DataConnect, vars?: RecordWeatherVariables): MutationRef<RecordWeatherData, RecordWeatherVariables>;

export function recordWeather(vars?: RecordWeatherVariables): MutationPromise<RecordWeatherData, RecordWeatherVariables>;
export function recordWeather(dc: DataConnect, vars?: RecordWeatherVariables): MutationPromise<RecordWeatherData, RecordWeatherVariables>;

/* Allow users to create refs without passing in DataConnect */
export function getCurrentUserRef(): QueryRef<GetCurrentUserData, undefined>;
/* Allow users to pass in custom DataConnect instances */
export function getCurrentUserRef(dc: DataConnect): QueryRef<GetCurrentUserData, undefined>;

export function getCurrentUser(): QueryPromise<GetCurrentUserData, undefined>;
export function getCurrentUser(dc: DataConnect): QueryPromise<GetCurrentUserData, undefined>;

/* Allow users to create refs without passing in DataConnect */
export function listGardenPlotsRef(vars?: ListGardenPlotsVariables): QueryRef<ListGardenPlotsData, ListGardenPlotsVariables>;
/* Allow users to pass in custom DataConnect instances */
export function listGardenPlotsRef(dc: DataConnect, vars?: ListGardenPlotsVariables): QueryRef<ListGardenPlotsData, ListGardenPlotsVariables>;

export function listGardenPlots(vars?: ListGardenPlotsVariables): QueryPromise<ListGardenPlotsData, ListGardenPlotsVariables>;
export function listGardenPlots(dc: DataConnect, vars?: ListGardenPlotsVariables): QueryPromise<ListGardenPlotsData, ListGardenPlotsVariables>;

/* Allow users to create refs without passing in DataConnect */
export function getPlotDetailsRef(vars: GetPlotDetailsVariables): QueryRef<GetPlotDetailsData, GetPlotDetailsVariables>;
/* Allow users to pass in custom DataConnect instances */
export function getPlotDetailsRef(dc: DataConnect, vars: GetPlotDetailsVariables): QueryRef<GetPlotDetailsData, GetPlotDetailsVariables>;

export function getPlotDetails(vars: GetPlotDetailsVariables): QueryPromise<GetPlotDetailsData, GetPlotDetailsVariables>;
export function getPlotDetails(dc: DataConnect, vars: GetPlotDetailsVariables): QueryPromise<GetPlotDetailsData, GetPlotDetailsVariables>;

/* Allow users to create refs without passing in DataConnect */
export function listPlantsRef(): QueryRef<ListPlantsData, undefined>;
/* Allow users to pass in custom DataConnect instances */
export function listPlantsRef(dc: DataConnect): QueryRef<ListPlantsData, undefined>;

export function listPlants(): QueryPromise<ListPlantsData, undefined>;
export function listPlants(dc: DataConnect): QueryPromise<ListPlantsData, undefined>;

/* Allow users to create refs without passing in DataConnect */
export function searchPlantsRef(vars: SearchPlantsVariables): QueryRef<SearchPlantsData, SearchPlantsVariables>;
/* Allow users to pass in custom DataConnect instances */
export function searchPlantsRef(dc: DataConnect, vars: SearchPlantsVariables): QueryRef<SearchPlantsData, SearchPlantsVariables>;

export function searchPlants(vars: SearchPlantsVariables): QueryPromise<SearchPlantsData, SearchPlantsVariables>;
export function searchPlants(dc: DataConnect, vars: SearchPlantsVariables): QueryPromise<SearchPlantsData, SearchPlantsVariables>;

/* Allow users to create refs without passing in DataConnect */
export function listTasksRef(vars?: ListTasksVariables): QueryRef<ListTasksData, ListTasksVariables>;
/* Allow users to pass in custom DataConnect instances */
export function listTasksRef(dc: DataConnect, vars?: ListTasksVariables): QueryRef<ListTasksData, ListTasksVariables>;

export function listTasks(vars?: ListTasksVariables): QueryPromise<ListTasksData, ListTasksVariables>;
export function listTasks(dc: DataConnect, vars?: ListTasksVariables): QueryPromise<ListTasksData, ListTasksVariables>;

/* Allow users to create refs without passing in DataConnect */
export function getMyTasksRef(): QueryRef<GetMyTasksData, undefined>;
/* Allow users to pass in custom DataConnect instances */
export function getMyTasksRef(dc: DataConnect): QueryRef<GetMyTasksData, undefined>;

export function getMyTasks(): QueryPromise<GetMyTasksData, undefined>;
export function getMyTasks(dc: DataConnect): QueryPromise<GetMyTasksData, undefined>;

/* Allow users to create refs without passing in DataConnect */
export function listUpcomingEventsRef(): QueryRef<ListUpcomingEventsData, undefined>;
/* Allow users to pass in custom DataConnect instances */
export function listUpcomingEventsRef(dc: DataConnect): QueryRef<ListUpcomingEventsData, undefined>;

export function listUpcomingEvents(): QueryPromise<ListUpcomingEventsData, undefined>;
export function listUpcomingEvents(dc: DataConnect): QueryPromise<ListUpcomingEventsData, undefined>;

/* Allow users to create refs without passing in DataConnect */
export function getEventDetailsRef(vars: GetEventDetailsVariables): QueryRef<GetEventDetailsData, GetEventDetailsVariables>;
/* Allow users to pass in custom DataConnect instances */
export function getEventDetailsRef(dc: DataConnect, vars: GetEventDetailsVariables): QueryRef<GetEventDetailsData, GetEventDetailsVariables>;

export function getEventDetails(vars: GetEventDetailsVariables): QueryPromise<GetEventDetailsData, GetEventDetailsVariables>;
export function getEventDetails(dc: DataConnect, vars: GetEventDetailsVariables): QueryPromise<GetEventDetailsData, GetEventDetailsVariables>;

/* Allow users to create refs without passing in DataConnect */
export function listResourcesRef(vars?: ListResourcesVariables): QueryRef<ListResourcesData, ListResourcesVariables>;
/* Allow users to pass in custom DataConnect instances */
export function listResourcesRef(dc: DataConnect, vars?: ListResourcesVariables): QueryRef<ListResourcesData, ListResourcesVariables>;

export function listResources(vars?: ListResourcesVariables): QueryPromise<ListResourcesData, ListResourcesVariables>;
export function listResources(dc: DataConnect, vars?: ListResourcesVariables): QueryPromise<ListResourcesData, ListResourcesVariables>;

/* Allow users to create refs without passing in DataConnect */
export function getResourceDetailsRef(vars: GetResourceDetailsVariables): QueryRef<GetResourceDetailsData, GetResourceDetailsVariables>;
/* Allow users to pass in custom DataConnect instances */
export function getResourceDetailsRef(dc: DataConnect, vars: GetResourceDetailsVariables): QueryRef<GetResourceDetailsData, GetResourceDetailsVariables>;

export function getResourceDetails(vars: GetResourceDetailsVariables): QueryPromise<GetResourceDetailsData, GetResourceDetailsVariables>;
export function getResourceDetails(dc: DataConnect, vars: GetResourceDetailsVariables): QueryPromise<GetResourceDetailsData, GetResourceDetailsVariables>;

/* Allow users to create refs without passing in DataConnect */
export function getRecentWeatherRef(vars: GetRecentWeatherVariables): QueryRef<GetRecentWeatherData, GetRecentWeatherVariables>;
/* Allow users to pass in custom DataConnect instances */
export function getRecentWeatherRef(dc: DataConnect, vars: GetRecentWeatherVariables): QueryRef<GetRecentWeatherData, GetRecentWeatherVariables>;

export function getRecentWeather(vars: GetRecentWeatherVariables): QueryPromise<GetRecentWeatherData, GetRecentWeatherVariables>;
export function getRecentWeather(dc: DataConnect, vars: GetRecentWeatherVariables): QueryPromise<GetRecentWeatherData, GetRecentWeatherVariables>;

