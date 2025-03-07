# Table of Contents
- [**Overview**](#generated-typescript-readme)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*GetCurrentUser*](#getcurrentuser)
  - [*ListGardenPlots*](#listgardenplots)
  - [*GetPlotDetails*](#getplotdetails)
  - [*ListPlants*](#listplants)
  - [*SearchPlants*](#searchplants)
  - [*ListTasks*](#listtasks)
  - [*GetMyTasks*](#getmytasks)
  - [*ListUpcomingEvents*](#listupcomingevents)
  - [*GetEventDetails*](#geteventdetails)
  - [*ListResources*](#listresources)
  - [*GetResourceDetails*](#getresourcedetails)
  - [*GetRecentWeather*](#getrecentweather)
- [**Mutations**](#mutations)
  - [*UpsertUserProfile*](#upsertuserprofile)
  - [*UpdateUserRole*](#updateuserrole)
  - [*CreatePlot*](#createplot)
  - [*UpdatePlot*](#updateplot)
  - [*AssignPlot*](#assignplot)
  - [*WaterPlot*](#waterplot)
  - [*AddPlant*](#addplant)
  - [*UpdatePlant*](#updateplant)
  - [*PlantInPlot*](#plantinplot)
  - [*UpdatePlantStatus*](#updateplantstatus)
  - [*RemovePlant*](#removeplant)
  - [*CreateTask*](#createtask)
  - [*UpdateTask*](#updatetask)
  - [*CompleteTask*](#completetask)
  - [*DeleteTask*](#deletetask)
  - [*CreateEvent*](#createevent)
  - [*UpdateEvent*](#updateevent)
  - [*RsvpToEvent*](#rsvptoevent)
  - [*CancelEvent*](#cancelevent)
  - [*CreateResource*](#createresource)
  - [*UpdateResource*](#updateresource)
  - [*DeleteResource*](#deleteresource)
  - [*RecordWeather*](#recordweather)

# Generated TypeScript README
This README will guide you through the process of using the generated TypeScript SDK package for the connector `default`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

You can use this generated SDK by importing from the package `@firebasegen/default-connector` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#set-client).

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `default`.

You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

```javascript
import { getDataConnect, DataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@firebasegen/default-connector';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#instrument-clients).

```javascript
import { connectDataConnectEmulator, getDataConnect, DataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@firebasegen/default-connector';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) from your generated SDK.

# Queries

There are two ways to execute a Data Connect Query using the generated Web SDK:
- Using a Query Reference function, which returns a `QueryRef`
  - The `QueryRef` can be used as an argument to `executeQuery()`, which will execute the Query and return a `QueryPromise`
- Using an action shortcut function, which returns a `QueryPromise`
  - Calling the action shortcut function will execute the Query and return a `QueryPromise`

The following is true for both the action shortcut function and the `QueryRef` function:
- The `QueryPromise` returned will resolve to the result of the Query once it has finished executing
- If the Query accepts arguments, both the action shortcut function and the `QueryRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Query
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `default` connector's generated functions to execute each query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-queries).

## GetCurrentUser
You can execute the `GetCurrentUser` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [default-connector/index.d.ts](./index.d.ts):
```javascript
getCurrentUser(): QueryPromise<GetCurrentUserData, undefined>;

getCurrentUserRef(): QueryRef<GetCurrentUserData, undefined>;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```javascript
getCurrentUser(dc: DataConnect): QueryPromise<GetCurrentUserData, undefined>;

getCurrentUserRef(dc: DataConnect): QueryRef<GetCurrentUserData, undefined>;
```

### Variables
The `GetCurrentUser` query has no variables.
### Return Type
Recall that executing the `GetCurrentUser` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetCurrentUserData`, which is defined in [default-connector/index.d.ts](./index.d.ts). It has the following fields:
```javascript
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
```
### Using `GetCurrentUser`'s action shortcut function

```javascript
import { getDataConnect, DataConnect } from 'firebase/data-connect';
import { connectorConfig, getCurrentUser } from '@firebasegen/default-connector';


// Call the `getCurrentUser()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getCurrentUser();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getCurrentUser(dataConnect);

console.log(data.currentUser);

// Or, you can use the `Promise` API.
getCurrentUser().then((response) => {
  const data = response.data;
  console.log(data.currentUser);
});
```

### Using `GetCurrentUser`'s `QueryRef` function

```javascript
import { getDataConnect, DataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getCurrentUserRef } from '@firebasegen/default-connector';


// Call the `getCurrentUserRef()` function to get a reference to the query.
const ref = getCurrentUserRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getCurrentUserRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.currentUser);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.currentUser);
});
```

## ListGardenPlots
You can execute the `ListGardenPlots` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [default-connector/index.d.ts](./index.d.ts):
```javascript
listGardenPlots(vars?: ListGardenPlotsVariables): QueryPromise<ListGardenPlotsData, ListGardenPlotsVariables>;

listGardenPlotsRef(vars?: ListGardenPlotsVariables): QueryRef<ListGardenPlotsData, ListGardenPlotsVariables>;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```javascript
listGardenPlots(dc: DataConnect, vars?: ListGardenPlotsVariables): QueryPromise<ListGardenPlotsData, ListGardenPlotsVariables>;

listGardenPlotsRef(dc: DataConnect, vars?: ListGardenPlotsVariables): QueryRef<ListGardenPlotsData, ListGardenPlotsVariables>;
```

### Variables
The `ListGardenPlots` query has an optional argument of type `ListGardenPlotsVariables`, which is defined in [default-connector/index.d.ts](./index.d.ts). It has the following fields:

```javascript
export interface ListGardenPlotsVariables {
  isActive?: boolean | null;
}
```
### Return Type
Recall that executing the `ListGardenPlots` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListGardenPlotsData`, which is defined in [default-connector/index.d.ts](./index.d.ts). It has the following fields:
```javascript
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
```
### Using `ListGardenPlots`'s action shortcut function

```javascript
import { getDataConnect, DataConnect } from 'firebase/data-connect';
import { connectorConfig, listGardenPlots, ListGardenPlotsVariables } from '@firebasegen/default-connector';

// The `ListGardenPlots` query has an optional argument of type `ListGardenPlotsVariables`:
const listGardenPlotsVars: ListGardenPlotsVariables = {
  isActive: ..., // optional
};

// Call the `listGardenPlots()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listGardenPlots(listGardenPlotsVars);
// Variables can be defined inline as well.
const { data } = await listGardenPlots({ isActive: ..., });
// Since all variables are optional for this query, you can omit the `ListGardenPlotsVariables` argument.
const { data } = await listGardenPlots();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listGardenPlots(dataConnect, listGardenPlotsVars);

console.log(data.plots);

// Or, you can use the `Promise` API.
listGardenPlots(listGardenPlotsVars).then((response) => {
  const data = response.data;
  console.log(data.plots);
});
```

### Using `ListGardenPlots`'s `QueryRef` function

```javascript
import { getDataConnect, DataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listGardenPlotsRef, ListGardenPlotsVariables } from '@firebasegen/default-connector';

// The `ListGardenPlots` query has an optional argument of type `ListGardenPlotsVariables`:
const listGardenPlotsVars: ListGardenPlotsVariables = {
  isActive: ..., // optional
};

// Call the `listGardenPlotsRef()` function to get a reference to the query.
const ref = listGardenPlotsRef(listGardenPlotsVars);
// Variables can be defined inline as well.
const ref = listGardenPlotsRef({ isActive: ..., });
// Since all variables are optional for this query, you can omit the `ListGardenPlotsVariables` argument.
const ref = listGardenPlotsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listGardenPlotsRef(dataConnect, listGardenPlotsVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.plots);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.plots);
});
```

## GetPlotDetails
You can execute the `GetPlotDetails` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [default-connector/index.d.ts](./index.d.ts):
```javascript
getPlotDetails(vars: GetPlotDetailsVariables): QueryPromise<GetPlotDetailsData, GetPlotDetailsVariables>;

getPlotDetailsRef(vars: GetPlotDetailsVariables): QueryRef<GetPlotDetailsData, GetPlotDetailsVariables>;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```javascript
getPlotDetails(dc: DataConnect, vars: GetPlotDetailsVariables): QueryPromise<GetPlotDetailsData, GetPlotDetailsVariables>;

getPlotDetailsRef(dc: DataConnect, vars: GetPlotDetailsVariables): QueryRef<GetPlotDetailsData, GetPlotDetailsVariables>;
```

### Variables
The `GetPlotDetails` query requires an argument of type `GetPlotDetailsVariables`, which is defined in [default-connector/index.d.ts](./index.d.ts). It has the following fields:

```javascript
export interface GetPlotDetailsVariables {
  plotId: UUIDString;
}
```
### Return Type
Recall that executing the `GetPlotDetails` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetPlotDetailsData`, which is defined in [default-connector/index.d.ts](./index.d.ts). It has the following fields:
```javascript
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
```
### Using `GetPlotDetails`'s action shortcut function

```javascript
import { getDataConnect, DataConnect } from 'firebase/data-connect';
import { connectorConfig, getPlotDetails, GetPlotDetailsVariables } from '@firebasegen/default-connector';

// The `GetPlotDetails` query requires an argument of type `GetPlotDetailsVariables`:
const getPlotDetailsVars: GetPlotDetailsVariables = {
  plotId: ..., 
};

// Call the `getPlotDetails()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getPlotDetails(getPlotDetailsVars);
// Variables can be defined inline as well.
const { data } = await getPlotDetails({ plotId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getPlotDetails(dataConnect, getPlotDetailsVars);

console.log(data.plot);

// Or, you can use the `Promise` API.
getPlotDetails(getPlotDetailsVars).then((response) => {
  const data = response.data;
  console.log(data.plot);
});
```

### Using `GetPlotDetails`'s `QueryRef` function

```javascript
import { getDataConnect, DataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getPlotDetailsRef, GetPlotDetailsVariables } from '@firebasegen/default-connector';

// The `GetPlotDetails` query requires an argument of type `GetPlotDetailsVariables`:
const getPlotDetailsVars: GetPlotDetailsVariables = {
  plotId: ..., 
};

// Call the `getPlotDetailsRef()` function to get a reference to the query.
const ref = getPlotDetailsRef(getPlotDetailsVars);
// Variables can be defined inline as well.
const ref = getPlotDetailsRef({ plotId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getPlotDetailsRef(dataConnect, getPlotDetailsVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.plot);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.plot);
});
```

## ListPlants
You can execute the `ListPlants` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [default-connector/index.d.ts](./index.d.ts):
```javascript
listPlants(): QueryPromise<ListPlantsData, undefined>;

listPlantsRef(): QueryRef<ListPlantsData, undefined>;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```javascript
listPlants(dc: DataConnect): QueryPromise<ListPlantsData, undefined>;

listPlantsRef(dc: DataConnect): QueryRef<ListPlantsData, undefined>;
```

### Variables
The `ListPlants` query has no variables.
### Return Type
Recall that executing the `ListPlants` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListPlantsData`, which is defined in [default-connector/index.d.ts](./index.d.ts). It has the following fields:
```javascript
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
```
### Using `ListPlants`'s action shortcut function

```javascript
import { getDataConnect, DataConnect } from 'firebase/data-connect';
import { connectorConfig, listPlants } from '@firebasegen/default-connector';


// Call the `listPlants()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listPlants();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listPlants(dataConnect);

console.log(data.plants);

// Or, you can use the `Promise` API.
listPlants().then((response) => {
  const data = response.data;
  console.log(data.plants);
});
```

### Using `ListPlants`'s `QueryRef` function

```javascript
import { getDataConnect, DataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listPlantsRef } from '@firebasegen/default-connector';


// Call the `listPlantsRef()` function to get a reference to the query.
const ref = listPlantsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listPlantsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.plants);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.plants);
});
```

## SearchPlants
You can execute the `SearchPlants` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [default-connector/index.d.ts](./index.d.ts):
```javascript
searchPlants(vars: SearchPlantsVariables): QueryPromise<SearchPlantsData, SearchPlantsVariables>;

searchPlantsRef(vars: SearchPlantsVariables): QueryRef<SearchPlantsData, SearchPlantsVariables>;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```javascript
searchPlants(dc: DataConnect, vars: SearchPlantsVariables): QueryPromise<SearchPlantsData, SearchPlantsVariables>;

searchPlantsRef(dc: DataConnect, vars: SearchPlantsVariables): QueryRef<SearchPlantsData, SearchPlantsVariables>;
```

### Variables
The `SearchPlants` query requires an argument of type `SearchPlantsVariables`, which is defined in [default-connector/index.d.ts](./index.d.ts). It has the following fields:

```javascript
export interface SearchPlantsVariables {
  searchTerm: string;
}
```
### Return Type
Recall that executing the `SearchPlants` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `SearchPlantsData`, which is defined in [default-connector/index.d.ts](./index.d.ts). It has the following fields:
```javascript
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
```
### Using `SearchPlants`'s action shortcut function

```javascript
import { getDataConnect, DataConnect } from 'firebase/data-connect';
import { connectorConfig, searchPlants, SearchPlantsVariables } from '@firebasegen/default-connector';

// The `SearchPlants` query requires an argument of type `SearchPlantsVariables`:
const searchPlantsVars: SearchPlantsVariables = {
  searchTerm: ..., 
};

// Call the `searchPlants()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await searchPlants(searchPlantsVars);
// Variables can be defined inline as well.
const { data } = await searchPlants({ searchTerm: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await searchPlants(dataConnect, searchPlantsVars);

console.log(data.plants);

// Or, you can use the `Promise` API.
searchPlants(searchPlantsVars).then((response) => {
  const data = response.data;
  console.log(data.plants);
});
```

### Using `SearchPlants`'s `QueryRef` function

```javascript
import { getDataConnect, DataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, searchPlantsRef, SearchPlantsVariables } from '@firebasegen/default-connector';

// The `SearchPlants` query requires an argument of type `SearchPlantsVariables`:
const searchPlantsVars: SearchPlantsVariables = {
  searchTerm: ..., 
};

// Call the `searchPlantsRef()` function to get a reference to the query.
const ref = searchPlantsRef(searchPlantsVars);
// Variables can be defined inline as well.
const ref = searchPlantsRef({ searchTerm: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = searchPlantsRef(dataConnect, searchPlantsVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.plants);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.plants);
});
```

## ListTasks
You can execute the `ListTasks` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [default-connector/index.d.ts](./index.d.ts):
```javascript
listTasks(vars?: ListTasksVariables): QueryPromise<ListTasksData, ListTasksVariables>;

listTasksRef(vars?: ListTasksVariables): QueryRef<ListTasksData, ListTasksVariables>;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```javascript
listTasks(dc: DataConnect, vars?: ListTasksVariables): QueryPromise<ListTasksData, ListTasksVariables>;

listTasksRef(dc: DataConnect, vars?: ListTasksVariables): QueryRef<ListTasksData, ListTasksVariables>;
```

### Variables
The `ListTasks` query has an optional argument of type `ListTasksVariables`, which is defined in [default-connector/index.d.ts](./index.d.ts). It has the following fields:

```javascript
export interface ListTasksVariables {
  status?: string | null;
  category?: string | null;
}
```
### Return Type
Recall that executing the `ListTasks` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListTasksData`, which is defined in [default-connector/index.d.ts](./index.d.ts). It has the following fields:
```javascript
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
```
### Using `ListTasks`'s action shortcut function

```javascript
import { getDataConnect, DataConnect } from 'firebase/data-connect';
import { connectorConfig, listTasks, ListTasksVariables } from '@firebasegen/default-connector';

// The `ListTasks` query has an optional argument of type `ListTasksVariables`:
const listTasksVars: ListTasksVariables = {
  status: ..., // optional
  category: ..., // optional
};

// Call the `listTasks()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listTasks(listTasksVars);
// Variables can be defined inline as well.
const { data } = await listTasks({ status: ..., category: ..., });
// Since all variables are optional for this query, you can omit the `ListTasksVariables` argument.
const { data } = await listTasks();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listTasks(dataConnect, listTasksVars);

console.log(data.tasks);

// Or, you can use the `Promise` API.
listTasks(listTasksVars).then((response) => {
  const data = response.data;
  console.log(data.tasks);
});
```

### Using `ListTasks`'s `QueryRef` function

```javascript
import { getDataConnect, DataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listTasksRef, ListTasksVariables } from '@firebasegen/default-connector';

// The `ListTasks` query has an optional argument of type `ListTasksVariables`:
const listTasksVars: ListTasksVariables = {
  status: ..., // optional
  category: ..., // optional
};

// Call the `listTasksRef()` function to get a reference to the query.
const ref = listTasksRef(listTasksVars);
// Variables can be defined inline as well.
const ref = listTasksRef({ status: ..., category: ..., });
// Since all variables are optional for this query, you can omit the `ListTasksVariables` argument.
const ref = listTasksRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listTasksRef(dataConnect, listTasksVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.tasks);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.tasks);
});
```

## GetMyTasks
You can execute the `GetMyTasks` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [default-connector/index.d.ts](./index.d.ts):
```javascript
getMyTasks(): QueryPromise<GetMyTasksData, undefined>;

getMyTasksRef(): QueryRef<GetMyTasksData, undefined>;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```javascript
getMyTasks(dc: DataConnect): QueryPromise<GetMyTasksData, undefined>;

getMyTasksRef(dc: DataConnect): QueryRef<GetMyTasksData, undefined>;
```

### Variables
The `GetMyTasks` query has no variables.
### Return Type
Recall that executing the `GetMyTasks` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetMyTasksData`, which is defined in [default-connector/index.d.ts](./index.d.ts). It has the following fields:
```javascript
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
```
### Using `GetMyTasks`'s action shortcut function

```javascript
import { getDataConnect, DataConnect } from 'firebase/data-connect';
import { connectorConfig, getMyTasks } from '@firebasegen/default-connector';


// Call the `getMyTasks()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getMyTasks();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getMyTasks(dataConnect);

console.log(data.tasks);

// Or, you can use the `Promise` API.
getMyTasks().then((response) => {
  const data = response.data;
  console.log(data.tasks);
});
```

### Using `GetMyTasks`'s `QueryRef` function

```javascript
import { getDataConnect, DataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getMyTasksRef } from '@firebasegen/default-connector';


// Call the `getMyTasksRef()` function to get a reference to the query.
const ref = getMyTasksRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getMyTasksRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.tasks);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.tasks);
});
```

## ListUpcomingEvents
You can execute the `ListUpcomingEvents` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [default-connector/index.d.ts](./index.d.ts):
```javascript
listUpcomingEvents(): QueryPromise<ListUpcomingEventsData, undefined>;

listUpcomingEventsRef(): QueryRef<ListUpcomingEventsData, undefined>;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```javascript
listUpcomingEvents(dc: DataConnect): QueryPromise<ListUpcomingEventsData, undefined>;

listUpcomingEventsRef(dc: DataConnect): QueryRef<ListUpcomingEventsData, undefined>;
```

### Variables
The `ListUpcomingEvents` query has no variables.
### Return Type
Recall that executing the `ListUpcomingEvents` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListUpcomingEventsData`, which is defined in [default-connector/index.d.ts](./index.d.ts). It has the following fields:
```javascript
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
```
### Using `ListUpcomingEvents`'s action shortcut function

```javascript
import { getDataConnect, DataConnect } from 'firebase/data-connect';
import { connectorConfig, listUpcomingEvents } from '@firebasegen/default-connector';


// Call the `listUpcomingEvents()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listUpcomingEvents();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listUpcomingEvents(dataConnect);

console.log(data.events);

// Or, you can use the `Promise` API.
listUpcomingEvents().then((response) => {
  const data = response.data;
  console.log(data.events);
});
```

### Using `ListUpcomingEvents`'s `QueryRef` function

```javascript
import { getDataConnect, DataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listUpcomingEventsRef } from '@firebasegen/default-connector';


// Call the `listUpcomingEventsRef()` function to get a reference to the query.
const ref = listUpcomingEventsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listUpcomingEventsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.events);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.events);
});
```

## GetEventDetails
You can execute the `GetEventDetails` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [default-connector/index.d.ts](./index.d.ts):
```javascript
getEventDetails(vars: GetEventDetailsVariables): QueryPromise<GetEventDetailsData, GetEventDetailsVariables>;

getEventDetailsRef(vars: GetEventDetailsVariables): QueryRef<GetEventDetailsData, GetEventDetailsVariables>;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```javascript
getEventDetails(dc: DataConnect, vars: GetEventDetailsVariables): QueryPromise<GetEventDetailsData, GetEventDetailsVariables>;

getEventDetailsRef(dc: DataConnect, vars: GetEventDetailsVariables): QueryRef<GetEventDetailsData, GetEventDetailsVariables>;
```

### Variables
The `GetEventDetails` query requires an argument of type `GetEventDetailsVariables`, which is defined in [default-connector/index.d.ts](./index.d.ts). It has the following fields:

```javascript
export interface GetEventDetailsVariables {
  eventId: UUIDString;
}
```
### Return Type
Recall that executing the `GetEventDetails` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetEventDetailsData`, which is defined in [default-connector/index.d.ts](./index.d.ts). It has the following fields:
```javascript
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
```
### Using `GetEventDetails`'s action shortcut function

```javascript
import { getDataConnect, DataConnect } from 'firebase/data-connect';
import { connectorConfig, getEventDetails, GetEventDetailsVariables } from '@firebasegen/default-connector';

// The `GetEventDetails` query requires an argument of type `GetEventDetailsVariables`:
const getEventDetailsVars: GetEventDetailsVariables = {
  eventId: ..., 
};

// Call the `getEventDetails()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getEventDetails(getEventDetailsVars);
// Variables can be defined inline as well.
const { data } = await getEventDetails({ eventId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getEventDetails(dataConnect, getEventDetailsVars);

console.log(data.event);

// Or, you can use the `Promise` API.
getEventDetails(getEventDetailsVars).then((response) => {
  const data = response.data;
  console.log(data.event);
});
```

### Using `GetEventDetails`'s `QueryRef` function

```javascript
import { getDataConnect, DataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getEventDetailsRef, GetEventDetailsVariables } from '@firebasegen/default-connector';

// The `GetEventDetails` query requires an argument of type `GetEventDetailsVariables`:
const getEventDetailsVars: GetEventDetailsVariables = {
  eventId: ..., 
};

// Call the `getEventDetailsRef()` function to get a reference to the query.
const ref = getEventDetailsRef(getEventDetailsVars);
// Variables can be defined inline as well.
const ref = getEventDetailsRef({ eventId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getEventDetailsRef(dataConnect, getEventDetailsVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.event);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.event);
});
```

## ListResources
You can execute the `ListResources` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [default-connector/index.d.ts](./index.d.ts):
```javascript
listResources(vars?: ListResourcesVariables): QueryPromise<ListResourcesData, ListResourcesVariables>;

listResourcesRef(vars?: ListResourcesVariables): QueryRef<ListResourcesData, ListResourcesVariables>;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```javascript
listResources(dc: DataConnect, vars?: ListResourcesVariables): QueryPromise<ListResourcesData, ListResourcesVariables>;

listResourcesRef(dc: DataConnect, vars?: ListResourcesVariables): QueryRef<ListResourcesData, ListResourcesVariables>;
```

### Variables
The `ListResources` query has an optional argument of type `ListResourcesVariables`, which is defined in [default-connector/index.d.ts](./index.d.ts). It has the following fields:

```javascript
export interface ListResourcesVariables {
  category?: string | null;
}
```
### Return Type
Recall that executing the `ListResources` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListResourcesData`, which is defined in [default-connector/index.d.ts](./index.d.ts). It has the following fields:
```javascript
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
```
### Using `ListResources`'s action shortcut function

```javascript
import { getDataConnect, DataConnect } from 'firebase/data-connect';
import { connectorConfig, listResources, ListResourcesVariables } from '@firebasegen/default-connector';

// The `ListResources` query has an optional argument of type `ListResourcesVariables`:
const listResourcesVars: ListResourcesVariables = {
  category: ..., // optional
};

// Call the `listResources()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listResources(listResourcesVars);
// Variables can be defined inline as well.
const { data } = await listResources({ category: ..., });
// Since all variables are optional for this query, you can omit the `ListResourcesVariables` argument.
const { data } = await listResources();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listResources(dataConnect, listResourcesVars);

console.log(data.resources);

// Or, you can use the `Promise` API.
listResources(listResourcesVars).then((response) => {
  const data = response.data;
  console.log(data.resources);
});
```

### Using `ListResources`'s `QueryRef` function

```javascript
import { getDataConnect, DataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listResourcesRef, ListResourcesVariables } from '@firebasegen/default-connector';

// The `ListResources` query has an optional argument of type `ListResourcesVariables`:
const listResourcesVars: ListResourcesVariables = {
  category: ..., // optional
};

// Call the `listResourcesRef()` function to get a reference to the query.
const ref = listResourcesRef(listResourcesVars);
// Variables can be defined inline as well.
const ref = listResourcesRef({ category: ..., });
// Since all variables are optional for this query, you can omit the `ListResourcesVariables` argument.
const ref = listResourcesRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listResourcesRef(dataConnect, listResourcesVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.resources);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.resources);
});
```

## GetResourceDetails
You can execute the `GetResourceDetails` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [default-connector/index.d.ts](./index.d.ts):
```javascript
getResourceDetails(vars: GetResourceDetailsVariables): QueryPromise<GetResourceDetailsData, GetResourceDetailsVariables>;

getResourceDetailsRef(vars: GetResourceDetailsVariables): QueryRef<GetResourceDetailsData, GetResourceDetailsVariables>;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```javascript
getResourceDetails(dc: DataConnect, vars: GetResourceDetailsVariables): QueryPromise<GetResourceDetailsData, GetResourceDetailsVariables>;

getResourceDetailsRef(dc: DataConnect, vars: GetResourceDetailsVariables): QueryRef<GetResourceDetailsData, GetResourceDetailsVariables>;
```

### Variables
The `GetResourceDetails` query requires an argument of type `GetResourceDetailsVariables`, which is defined in [default-connector/index.d.ts](./index.d.ts). It has the following fields:

```javascript
export interface GetResourceDetailsVariables {
  resourceId: UUIDString;
}
```
### Return Type
Recall that executing the `GetResourceDetails` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetResourceDetailsData`, which is defined in [default-connector/index.d.ts](./index.d.ts). It has the following fields:
```javascript
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
```
### Using `GetResourceDetails`'s action shortcut function

```javascript
import { getDataConnect, DataConnect } from 'firebase/data-connect';
import { connectorConfig, getResourceDetails, GetResourceDetailsVariables } from '@firebasegen/default-connector';

// The `GetResourceDetails` query requires an argument of type `GetResourceDetailsVariables`:
const getResourceDetailsVars: GetResourceDetailsVariables = {
  resourceId: ..., 
};

// Call the `getResourceDetails()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getResourceDetails(getResourceDetailsVars);
// Variables can be defined inline as well.
const { data } = await getResourceDetails({ resourceId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getResourceDetails(dataConnect, getResourceDetailsVars);

console.log(data.resource);

// Or, you can use the `Promise` API.
getResourceDetails(getResourceDetailsVars).then((response) => {
  const data = response.data;
  console.log(data.resource);
});
```

### Using `GetResourceDetails`'s `QueryRef` function

```javascript
import { getDataConnect, DataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getResourceDetailsRef, GetResourceDetailsVariables } from '@firebasegen/default-connector';

// The `GetResourceDetails` query requires an argument of type `GetResourceDetailsVariables`:
const getResourceDetailsVars: GetResourceDetailsVariables = {
  resourceId: ..., 
};

// Call the `getResourceDetailsRef()` function to get a reference to the query.
const ref = getResourceDetailsRef(getResourceDetailsVars);
// Variables can be defined inline as well.
const ref = getResourceDetailsRef({ resourceId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getResourceDetailsRef(dataConnect, getResourceDetailsVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.resource);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.resource);
});
```

## GetRecentWeather
You can execute the `GetRecentWeather` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [default-connector/index.d.ts](./index.d.ts):
```javascript
getRecentWeather(vars: GetRecentWeatherVariables): QueryPromise<GetRecentWeatherData, GetRecentWeatherVariables>;

getRecentWeatherRef(vars: GetRecentWeatherVariables): QueryRef<GetRecentWeatherData, GetRecentWeatherVariables>;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```javascript
getRecentWeather(dc: DataConnect, vars: GetRecentWeatherVariables): QueryPromise<GetRecentWeatherData, GetRecentWeatherVariables>;

getRecentWeatherRef(dc: DataConnect, vars: GetRecentWeatherVariables): QueryRef<GetRecentWeatherData, GetRecentWeatherVariables>;
```

### Variables
The `GetRecentWeather` query requires an argument of type `GetRecentWeatherVariables`, which is defined in [default-connector/index.d.ts](./index.d.ts). It has the following fields:

```javascript
export interface GetRecentWeatherVariables {
  days: number;
}
```
### Return Type
Recall that executing the `GetRecentWeather` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetRecentWeatherData`, which is defined in [default-connector/index.d.ts](./index.d.ts). It has the following fields:
```javascript
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
```
### Using `GetRecentWeather`'s action shortcut function

```javascript
import { getDataConnect, DataConnect } from 'firebase/data-connect';
import { connectorConfig, getRecentWeather, GetRecentWeatherVariables } from '@firebasegen/default-connector';

// The `GetRecentWeather` query requires an argument of type `GetRecentWeatherVariables`:
const getRecentWeatherVars: GetRecentWeatherVariables = {
  days: ..., 
};

// Call the `getRecentWeather()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getRecentWeather(getRecentWeatherVars);
// Variables can be defined inline as well.
const { data } = await getRecentWeather({ days: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getRecentWeather(dataConnect, getRecentWeatherVars);

console.log(data.weatherRecords);

// Or, you can use the `Promise` API.
getRecentWeather(getRecentWeatherVars).then((response) => {
  const data = response.data;
  console.log(data.weatherRecords);
});
```

### Using `GetRecentWeather`'s `QueryRef` function

```javascript
import { getDataConnect, DataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getRecentWeatherRef, GetRecentWeatherVariables } from '@firebasegen/default-connector';

// The `GetRecentWeather` query requires an argument of type `GetRecentWeatherVariables`:
const getRecentWeatherVars: GetRecentWeatherVariables = {
  days: ..., 
};

// Call the `getRecentWeatherRef()` function to get a reference to the query.
const ref = getRecentWeatherRef(getRecentWeatherVars);
// Variables can be defined inline as well.
const ref = getRecentWeatherRef({ days: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getRecentWeatherRef(dataConnect, getRecentWeatherVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.weatherRecords);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.weatherRecords);
});
```

# Mutations

There are two ways to execute a Data Connect Mutation using the generated Web SDK:
- Using a Mutation Reference function, which returns a `MutationRef`
  - The `MutationRef` can be used as an argument to `executeMutation()`, which will execute the Mutation and return a `MutationPromise`
- Using an action shortcut function, which returns a `MutationPromise`
  - Calling the action shortcut function will execute the Mutation and return a `MutationPromise`

The following is true for both the action shortcut function and the `MutationRef` function:
- The `MutationPromise` returned will resolve to the result of the Mutation once it has finished executing
- If the Mutation accepts arguments, both the action shortcut function and the `MutationRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Mutation
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `default` connector's generated functions to execute each mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-mutations).

## UpsertUserProfile
You can execute the `UpsertUserProfile` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [default-connector/index.d.ts](./index.d.ts):
```javascript
upsertUserProfile(vars: UpsertUserProfileVariables): MutationPromise<UpsertUserProfileData, UpsertUserProfileVariables>;

upsertUserProfileRef(vars: UpsertUserProfileVariables): MutationRef<UpsertUserProfileData, UpsertUserProfileVariables>;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```javascript
upsertUserProfile(dc: DataConnect, vars: UpsertUserProfileVariables): MutationPromise<UpsertUserProfileData, UpsertUserProfileVariables>;

upsertUserProfileRef(dc: DataConnect, vars: UpsertUserProfileVariables): MutationRef<UpsertUserProfileData, UpsertUserProfileVariables>;
```

### Variables
The `UpsertUserProfile` mutation requires an argument of type `UpsertUserProfileVariables`, which is defined in [default-connector/index.d.ts](./index.d.ts). It has the following fields:

```javascript
export interface UpsertUserProfileVariables {
  displayName: string;
  email: string;
  photoURL?: string | null;
  role?: string | null;
}
```
### Return Type
Recall that executing the `UpsertUserProfile` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpsertUserProfileData`, which is defined in [default-connector/index.d.ts](./index.d.ts). It has the following fields:
```javascript
export interface UpsertUserProfileData {
  gardenUser_upsert: GardenUser_Key;
}
```
### Using `UpsertUserProfile`'s action shortcut function

```javascript
import { getDataConnect, DataConnect } from 'firebase/data-connect';
import { connectorConfig, upsertUserProfile, UpsertUserProfileVariables } from '@firebasegen/default-connector';

// The `UpsertUserProfile` mutation requires an argument of type `UpsertUserProfileVariables`:
const upsertUserProfileVars: UpsertUserProfileVariables = {
  displayName: ..., 
  email: ..., 
  photoURL: ..., // optional
  role: ..., // optional
};

// Call the `upsertUserProfile()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await upsertUserProfile(upsertUserProfileVars);
// Variables can be defined inline as well.
const { data } = await upsertUserProfile({ displayName: ..., email: ..., photoURL: ..., role: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await upsertUserProfile(dataConnect, upsertUserProfileVars);

console.log(data.gardenUser_upsert);

// Or, you can use the `Promise` API.
upsertUserProfile(upsertUserProfileVars).then((response) => {
  const data = response.data;
  console.log(data.gardenUser_upsert);
});
```

### Using `UpsertUserProfile`'s `MutationRef` function

```javascript
import { getDataConnect, DataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, upsertUserProfileRef, UpsertUserProfileVariables } from '@firebasegen/default-connector';

// The `UpsertUserProfile` mutation requires an argument of type `UpsertUserProfileVariables`:
const upsertUserProfileVars: UpsertUserProfileVariables = {
  displayName: ..., 
  email: ..., 
  photoURL: ..., // optional
  role: ..., // optional
};

// Call the `upsertUserProfileRef()` function to get a reference to the mutation.
const ref = upsertUserProfileRef(upsertUserProfileVars);
// Variables can be defined inline as well.
const ref = upsertUserProfileRef({ displayName: ..., email: ..., photoURL: ..., role: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = upsertUserProfileRef(dataConnect, upsertUserProfileVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.gardenUser_upsert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.gardenUser_upsert);
});
```

## UpdateUserRole
You can execute the `UpdateUserRole` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [default-connector/index.d.ts](./index.d.ts):
```javascript
updateUserRole(vars: UpdateUserRoleVariables): MutationPromise<UpdateUserRoleData, UpdateUserRoleVariables>;

updateUserRoleRef(vars: UpdateUserRoleVariables): MutationRef<UpdateUserRoleData, UpdateUserRoleVariables>;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```javascript
updateUserRole(dc: DataConnect, vars: UpdateUserRoleVariables): MutationPromise<UpdateUserRoleData, UpdateUserRoleVariables>;

updateUserRoleRef(dc: DataConnect, vars: UpdateUserRoleVariables): MutationRef<UpdateUserRoleData, UpdateUserRoleVariables>;
```

### Variables
The `UpdateUserRole` mutation requires an argument of type `UpdateUserRoleVariables`, which is defined in [default-connector/index.d.ts](./index.d.ts). It has the following fields:

```javascript
export interface UpdateUserRoleVariables {
  userId: string;
  role: string;
}
```
### Return Type
Recall that executing the `UpdateUserRole` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateUserRoleData`, which is defined in [default-connector/index.d.ts](./index.d.ts). It has the following fields:
```javascript
export interface UpdateUserRoleData {
  gardenUser_update?: GardenUser_Key | null;
}
```
### Using `UpdateUserRole`'s action shortcut function

```javascript
import { getDataConnect, DataConnect } from 'firebase/data-connect';
import { connectorConfig, updateUserRole, UpdateUserRoleVariables } from '@firebasegen/default-connector';

// The `UpdateUserRole` mutation requires an argument of type `UpdateUserRoleVariables`:
const updateUserRoleVars: UpdateUserRoleVariables = {
  userId: ..., 
  role: ..., 
};

// Call the `updateUserRole()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateUserRole(updateUserRoleVars);
// Variables can be defined inline as well.
const { data } = await updateUserRole({ userId: ..., role: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateUserRole(dataConnect, updateUserRoleVars);

console.log(data.gardenUser_update);

// Or, you can use the `Promise` API.
updateUserRole(updateUserRoleVars).then((response) => {
  const data = response.data;
  console.log(data.gardenUser_update);
});
```

### Using `UpdateUserRole`'s `MutationRef` function

```javascript
import { getDataConnect, DataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateUserRoleRef, UpdateUserRoleVariables } from '@firebasegen/default-connector';

// The `UpdateUserRole` mutation requires an argument of type `UpdateUserRoleVariables`:
const updateUserRoleVars: UpdateUserRoleVariables = {
  userId: ..., 
  role: ..., 
};

// Call the `updateUserRoleRef()` function to get a reference to the mutation.
const ref = updateUserRoleRef(updateUserRoleVars);
// Variables can be defined inline as well.
const ref = updateUserRoleRef({ userId: ..., role: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateUserRoleRef(dataConnect, updateUserRoleVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.gardenUser_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.gardenUser_update);
});
```

## CreatePlot
You can execute the `CreatePlot` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [default-connector/index.d.ts](./index.d.ts):
```javascript
createPlot(vars: CreatePlotVariables): MutationPromise<CreatePlotData, CreatePlotVariables>;

createPlotRef(vars: CreatePlotVariables): MutationRef<CreatePlotData, CreatePlotVariables>;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```javascript
createPlot(dc: DataConnect, vars: CreatePlotVariables): MutationPromise<CreatePlotData, CreatePlotVariables>;

createPlotRef(dc: DataConnect, vars: CreatePlotVariables): MutationRef<CreatePlotData, CreatePlotVariables>;
```

### Variables
The `CreatePlot` mutation requires an argument of type `CreatePlotVariables`, which is defined in [default-connector/index.d.ts](./index.d.ts). It has the following fields:

```javascript
export interface CreatePlotVariables {
  plotNumber: string;
  sizeInSqFt?: number | null;
  location?: string | null;
  soilType?: string | null;
  sunExposure?: string | null;
}
```
### Return Type
Recall that executing the `CreatePlot` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreatePlotData`, which is defined in [default-connector/index.d.ts](./index.d.ts). It has the following fields:
```javascript
export interface CreatePlotData {
  plot_insert: Plot_Key;
}
```
### Using `CreatePlot`'s action shortcut function

```javascript
import { getDataConnect, DataConnect } from 'firebase/data-connect';
import { connectorConfig, createPlot, CreatePlotVariables } from '@firebasegen/default-connector';

// The `CreatePlot` mutation requires an argument of type `CreatePlotVariables`:
const createPlotVars: CreatePlotVariables = {
  plotNumber: ..., 
  sizeInSqFt: ..., // optional
  location: ..., // optional
  soilType: ..., // optional
  sunExposure: ..., // optional
};

// Call the `createPlot()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createPlot(createPlotVars);
// Variables can be defined inline as well.
const { data } = await createPlot({ plotNumber: ..., sizeInSqFt: ..., location: ..., soilType: ..., sunExposure: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createPlot(dataConnect, createPlotVars);

console.log(data.plot_insert);

// Or, you can use the `Promise` API.
createPlot(createPlotVars).then((response) => {
  const data = response.data;
  console.log(data.plot_insert);
});
```

### Using `CreatePlot`'s `MutationRef` function

```javascript
import { getDataConnect, DataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createPlotRef, CreatePlotVariables } from '@firebasegen/default-connector';

// The `CreatePlot` mutation requires an argument of type `CreatePlotVariables`:
const createPlotVars: CreatePlotVariables = {
  plotNumber: ..., 
  sizeInSqFt: ..., // optional
  location: ..., // optional
  soilType: ..., // optional
  sunExposure: ..., // optional
};

// Call the `createPlotRef()` function to get a reference to the mutation.
const ref = createPlotRef(createPlotVars);
// Variables can be defined inline as well.
const ref = createPlotRef({ plotNumber: ..., sizeInSqFt: ..., location: ..., soilType: ..., sunExposure: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createPlotRef(dataConnect, createPlotVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.plot_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.plot_insert);
});
```

## UpdatePlot
You can execute the `UpdatePlot` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [default-connector/index.d.ts](./index.d.ts):
```javascript
updatePlot(vars: UpdatePlotVariables): MutationPromise<UpdatePlotData, UpdatePlotVariables>;

updatePlotRef(vars: UpdatePlotVariables): MutationRef<UpdatePlotData, UpdatePlotVariables>;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```javascript
updatePlot(dc: DataConnect, vars: UpdatePlotVariables): MutationPromise<UpdatePlotData, UpdatePlotVariables>;

updatePlotRef(dc: DataConnect, vars: UpdatePlotVariables): MutationRef<UpdatePlotData, UpdatePlotVariables>;
```

### Variables
The `UpdatePlot` mutation requires an argument of type `UpdatePlotVariables`, which is defined in [default-connector/index.d.ts](./index.d.ts). It has the following fields:

```javascript
export interface UpdatePlotVariables {
  plotId: UUIDString;
  plotNumber?: string | null;
  sizeInSqFt?: number | null;
  location?: string | null;
  soilType?: string | null;
  sunExposure?: string | null;
  isActive?: boolean | null;
}
```
### Return Type
Recall that executing the `UpdatePlot` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdatePlotData`, which is defined in [default-connector/index.d.ts](./index.d.ts). It has the following fields:
```javascript
export interface UpdatePlotData {
  plot_update?: Plot_Key | null;
}
```
### Using `UpdatePlot`'s action shortcut function

```javascript
import { getDataConnect, DataConnect } from 'firebase/data-connect';
import { connectorConfig, updatePlot, UpdatePlotVariables } from '@firebasegen/default-connector';

// The `UpdatePlot` mutation requires an argument of type `UpdatePlotVariables`:
const updatePlotVars: UpdatePlotVariables = {
  plotId: ..., 
  plotNumber: ..., // optional
  sizeInSqFt: ..., // optional
  location: ..., // optional
  soilType: ..., // optional
  sunExposure: ..., // optional
  isActive: ..., // optional
};

// Call the `updatePlot()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updatePlot(updatePlotVars);
// Variables can be defined inline as well.
const { data } = await updatePlot({ plotId: ..., plotNumber: ..., sizeInSqFt: ..., location: ..., soilType: ..., sunExposure: ..., isActive: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updatePlot(dataConnect, updatePlotVars);

console.log(data.plot_update);

// Or, you can use the `Promise` API.
updatePlot(updatePlotVars).then((response) => {
  const data = response.data;
  console.log(data.plot_update);
});
```

### Using `UpdatePlot`'s `MutationRef` function

```javascript
import { getDataConnect, DataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updatePlotRef, UpdatePlotVariables } from '@firebasegen/default-connector';

// The `UpdatePlot` mutation requires an argument of type `UpdatePlotVariables`:
const updatePlotVars: UpdatePlotVariables = {
  plotId: ..., 
  plotNumber: ..., // optional
  sizeInSqFt: ..., // optional
  location: ..., // optional
  soilType: ..., // optional
  sunExposure: ..., // optional
  isActive: ..., // optional
};

// Call the `updatePlotRef()` function to get a reference to the mutation.
const ref = updatePlotRef(updatePlotVars);
// Variables can be defined inline as well.
const ref = updatePlotRef({ plotId: ..., plotNumber: ..., sizeInSqFt: ..., location: ..., soilType: ..., sunExposure: ..., isActive: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updatePlotRef(dataConnect, updatePlotVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.plot_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.plot_update);
});
```

## AssignPlot
You can execute the `AssignPlot` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [default-connector/index.d.ts](./index.d.ts):
```javascript
assignPlot(vars: AssignPlotVariables): MutationPromise<AssignPlotData, AssignPlotVariables>;

assignPlotRef(vars: AssignPlotVariables): MutationRef<AssignPlotData, AssignPlotVariables>;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```javascript
assignPlot(dc: DataConnect, vars: AssignPlotVariables): MutationPromise<AssignPlotData, AssignPlotVariables>;

assignPlotRef(dc: DataConnect, vars: AssignPlotVariables): MutationRef<AssignPlotData, AssignPlotVariables>;
```

### Variables
The `AssignPlot` mutation requires an argument of type `AssignPlotVariables`, which is defined in [default-connector/index.d.ts](./index.d.ts). It has the following fields:

```javascript
export interface AssignPlotVariables {
  plotId: UUIDString;
  userId: string;
}
```
### Return Type
Recall that executing the `AssignPlot` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AssignPlotData`, which is defined in [default-connector/index.d.ts](./index.d.ts). It has the following fields:
```javascript
export interface AssignPlotData {
  plot_update?: Plot_Key | null;
}
```
### Using `AssignPlot`'s action shortcut function

```javascript
import { getDataConnect, DataConnect } from 'firebase/data-connect';
import { connectorConfig, assignPlot, AssignPlotVariables } from '@firebasegen/default-connector';

// The `AssignPlot` mutation requires an argument of type `AssignPlotVariables`:
const assignPlotVars: AssignPlotVariables = {
  plotId: ..., 
  userId: ..., 
};

// Call the `assignPlot()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await assignPlot(assignPlotVars);
// Variables can be defined inline as well.
const { data } = await assignPlot({ plotId: ..., userId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await assignPlot(dataConnect, assignPlotVars);

console.log(data.plot_update);

// Or, you can use the `Promise` API.
assignPlot(assignPlotVars).then((response) => {
  const data = response.data;
  console.log(data.plot_update);
});
```

### Using `AssignPlot`'s `MutationRef` function

```javascript
import { getDataConnect, DataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, assignPlotRef, AssignPlotVariables } from '@firebasegen/default-connector';

// The `AssignPlot` mutation requires an argument of type `AssignPlotVariables`:
const assignPlotVars: AssignPlotVariables = {
  plotId: ..., 
  userId: ..., 
};

// Call the `assignPlotRef()` function to get a reference to the mutation.
const ref = assignPlotRef(assignPlotVars);
// Variables can be defined inline as well.
const ref = assignPlotRef({ plotId: ..., userId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = assignPlotRef(dataConnect, assignPlotVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.plot_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.plot_update);
});
```

## WaterPlot
You can execute the `WaterPlot` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [default-connector/index.d.ts](./index.d.ts):
```javascript
waterPlot(vars: WaterPlotVariables): MutationPromise<WaterPlotData, WaterPlotVariables>;

waterPlotRef(vars: WaterPlotVariables): MutationRef<WaterPlotData, WaterPlotVariables>;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```javascript
waterPlot(dc: DataConnect, vars: WaterPlotVariables): MutationPromise<WaterPlotData, WaterPlotVariables>;

waterPlotRef(dc: DataConnect, vars: WaterPlotVariables): MutationRef<WaterPlotData, WaterPlotVariables>;
```

### Variables
The `WaterPlot` mutation requires an argument of type `WaterPlotVariables`, which is defined in [default-connector/index.d.ts](./index.d.ts). It has the following fields:

```javascript
export interface WaterPlotVariables {
  plotId: UUIDString;
}
```
### Return Type
Recall that executing the `WaterPlot` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `WaterPlotData`, which is defined in [default-connector/index.d.ts](./index.d.ts). It has the following fields:
```javascript
export interface WaterPlotData {
  plot_update?: Plot_Key | null;
}
```
### Using `WaterPlot`'s action shortcut function

```javascript
import { getDataConnect, DataConnect } from 'firebase/data-connect';
import { connectorConfig, waterPlot, WaterPlotVariables } from '@firebasegen/default-connector';

// The `WaterPlot` mutation requires an argument of type `WaterPlotVariables`:
const waterPlotVars: WaterPlotVariables = {
  plotId: ..., 
};

// Call the `waterPlot()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await waterPlot(waterPlotVars);
// Variables can be defined inline as well.
const { data } = await waterPlot({ plotId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await waterPlot(dataConnect, waterPlotVars);

console.log(data.plot_update);

// Or, you can use the `Promise` API.
waterPlot(waterPlotVars).then((response) => {
  const data = response.data;
  console.log(data.plot_update);
});
```

### Using `WaterPlot`'s `MutationRef` function

```javascript
import { getDataConnect, DataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, waterPlotRef, WaterPlotVariables } from '@firebasegen/default-connector';

// The `WaterPlot` mutation requires an argument of type `WaterPlotVariables`:
const waterPlotVars: WaterPlotVariables = {
  plotId: ..., 
};

// Call the `waterPlotRef()` function to get a reference to the mutation.
const ref = waterPlotRef(waterPlotVars);
// Variables can be defined inline as well.
const ref = waterPlotRef({ plotId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = waterPlotRef(dataConnect, waterPlotVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.plot_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.plot_update);
});
```

## AddPlant
You can execute the `AddPlant` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [default-connector/index.d.ts](./index.d.ts):
```javascript
addPlant(vars: AddPlantVariables): MutationPromise<AddPlantData, AddPlantVariables>;

addPlantRef(vars: AddPlantVariables): MutationRef<AddPlantData, AddPlantVariables>;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```javascript
addPlant(dc: DataConnect, vars: AddPlantVariables): MutationPromise<AddPlantData, AddPlantVariables>;

addPlantRef(dc: DataConnect, vars: AddPlantVariables): MutationRef<AddPlantData, AddPlantVariables>;
```

### Variables
The `AddPlant` mutation requires an argument of type `AddPlantVariables`, which is defined in [default-connector/index.d.ts](./index.d.ts). It has the following fields:

```javascript
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
```
### Return Type
Recall that executing the `AddPlant` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AddPlantData`, which is defined in [default-connector/index.d.ts](./index.d.ts). It has the following fields:
```javascript
export interface AddPlantData {
  plant_insert: Plant_Key;
}
```
### Using `AddPlant`'s action shortcut function

```javascript
import { getDataConnect, DataConnect } from 'firebase/data-connect';
import { connectorConfig, addPlant, AddPlantVariables } from '@firebasegen/default-connector';

// The `AddPlant` mutation requires an argument of type `AddPlantVariables`:
const addPlantVars: AddPlantVariables = {
  name: ..., 
  scientificName: ..., // optional
  plantType: ..., 
  growingSeason: ..., // optional
  sunRequirement: ..., // optional
  waterRequirement: ..., // optional
  daysToHarvest: ..., // optional
  spacingInInches: ..., // optional
  companions: ..., // optional
  imageUrl: ..., // optional
};

// Call the `addPlant()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await addPlant(addPlantVars);
// Variables can be defined inline as well.
const { data } = await addPlant({ name: ..., scientificName: ..., plantType: ..., growingSeason: ..., sunRequirement: ..., waterRequirement: ..., daysToHarvest: ..., spacingInInches: ..., companions: ..., imageUrl: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await addPlant(dataConnect, addPlantVars);

console.log(data.plant_insert);

// Or, you can use the `Promise` API.
addPlant(addPlantVars).then((response) => {
  const data = response.data;
  console.log(data.plant_insert);
});
```

### Using `AddPlant`'s `MutationRef` function

```javascript
import { getDataConnect, DataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, addPlantRef, AddPlantVariables } from '@firebasegen/default-connector';

// The `AddPlant` mutation requires an argument of type `AddPlantVariables`:
const addPlantVars: AddPlantVariables = {
  name: ..., 
  scientificName: ..., // optional
  plantType: ..., 
  growingSeason: ..., // optional
  sunRequirement: ..., // optional
  waterRequirement: ..., // optional
  daysToHarvest: ..., // optional
  spacingInInches: ..., // optional
  companions: ..., // optional
  imageUrl: ..., // optional
};

// Call the `addPlantRef()` function to get a reference to the mutation.
const ref = addPlantRef(addPlantVars);
// Variables can be defined inline as well.
const ref = addPlantRef({ name: ..., scientificName: ..., plantType: ..., growingSeason: ..., sunRequirement: ..., waterRequirement: ..., daysToHarvest: ..., spacingInInches: ..., companions: ..., imageUrl: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = addPlantRef(dataConnect, addPlantVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.plant_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.plant_insert);
});
```

## UpdatePlant
You can execute the `UpdatePlant` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [default-connector/index.d.ts](./index.d.ts):
```javascript
updatePlant(vars: UpdatePlantVariables): MutationPromise<UpdatePlantData, UpdatePlantVariables>;

updatePlantRef(vars: UpdatePlantVariables): MutationRef<UpdatePlantData, UpdatePlantVariables>;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```javascript
updatePlant(dc: DataConnect, vars: UpdatePlantVariables): MutationPromise<UpdatePlantData, UpdatePlantVariables>;

updatePlantRef(dc: DataConnect, vars: UpdatePlantVariables): MutationRef<UpdatePlantData, UpdatePlantVariables>;
```

### Variables
The `UpdatePlant` mutation requires an argument of type `UpdatePlantVariables`, which is defined in [default-connector/index.d.ts](./index.d.ts). It has the following fields:

```javascript
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
```
### Return Type
Recall that executing the `UpdatePlant` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdatePlantData`, which is defined in [default-connector/index.d.ts](./index.d.ts). It has the following fields:
```javascript
export interface UpdatePlantData {
  plant_update?: Plant_Key | null;
}
```
### Using `UpdatePlant`'s action shortcut function

```javascript
import { getDataConnect, DataConnect } from 'firebase/data-connect';
import { connectorConfig, updatePlant, UpdatePlantVariables } from '@firebasegen/default-connector';

// The `UpdatePlant` mutation requires an argument of type `UpdatePlantVariables`:
const updatePlantVars: UpdatePlantVariables = {
  plantId: ..., 
  name: ..., // optional
  scientificName: ..., // optional
  plantType: ..., // optional
  growingSeason: ..., // optional
  sunRequirement: ..., // optional
  waterRequirement: ..., // optional
  daysToHarvest: ..., // optional
  spacingInInches: ..., // optional
  companions: ..., // optional
  imageUrl: ..., // optional
};

// Call the `updatePlant()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updatePlant(updatePlantVars);
// Variables can be defined inline as well.
const { data } = await updatePlant({ plantId: ..., name: ..., scientificName: ..., plantType: ..., growingSeason: ..., sunRequirement: ..., waterRequirement: ..., daysToHarvest: ..., spacingInInches: ..., companions: ..., imageUrl: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updatePlant(dataConnect, updatePlantVars);

console.log(data.plant_update);

// Or, you can use the `Promise` API.
updatePlant(updatePlantVars).then((response) => {
  const data = response.data;
  console.log(data.plant_update);
});
```

### Using `UpdatePlant`'s `MutationRef` function

```javascript
import { getDataConnect, DataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updatePlantRef, UpdatePlantVariables } from '@firebasegen/default-connector';

// The `UpdatePlant` mutation requires an argument of type `UpdatePlantVariables`:
const updatePlantVars: UpdatePlantVariables = {
  plantId: ..., 
  name: ..., // optional
  scientificName: ..., // optional
  plantType: ..., // optional
  growingSeason: ..., // optional
  sunRequirement: ..., // optional
  waterRequirement: ..., // optional
  daysToHarvest: ..., // optional
  spacingInInches: ..., // optional
  companions: ..., // optional
  imageUrl: ..., // optional
};

// Call the `updatePlantRef()` function to get a reference to the mutation.
const ref = updatePlantRef(updatePlantVars);
// Variables can be defined inline as well.
const ref = updatePlantRef({ plantId: ..., name: ..., scientificName: ..., plantType: ..., growingSeason: ..., sunRequirement: ..., waterRequirement: ..., daysToHarvest: ..., spacingInInches: ..., companions: ..., imageUrl: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updatePlantRef(dataConnect, updatePlantVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.plant_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.plant_update);
});
```

## PlantInPlot
You can execute the `PlantInPlot` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [default-connector/index.d.ts](./index.d.ts):
```javascript
plantInPlot(vars: PlantInPlotVariables): MutationPromise<PlantInPlotData, PlantInPlotVariables>;

plantInPlotRef(vars: PlantInPlotVariables): MutationRef<PlantInPlotData, PlantInPlotVariables>;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```javascript
plantInPlot(dc: DataConnect, vars: PlantInPlotVariables): MutationPromise<PlantInPlotData, PlantInPlotVariables>;

plantInPlotRef(dc: DataConnect, vars: PlantInPlotVariables): MutationRef<PlantInPlotData, PlantInPlotVariables>;
```

### Variables
The `PlantInPlot` mutation requires an argument of type `PlantInPlotVariables`, which is defined in [default-connector/index.d.ts](./index.d.ts). It has the following fields:

```javascript
export interface PlantInPlotVariables {
  plotId: UUIDString;
  plantId: UUIDString;
  expectedHarvestDate?: DateString | null;
  notes?: string | null;
}
```
### Return Type
Recall that executing the `PlantInPlot` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `PlantInPlotData`, which is defined in [default-connector/index.d.ts](./index.d.ts). It has the following fields:
```javascript
export interface PlantInPlotData {
  plantInstance_insert: PlantInstance_Key;
}
```
### Using `PlantInPlot`'s action shortcut function

```javascript
import { getDataConnect, DataConnect } from 'firebase/data-connect';
import { connectorConfig, plantInPlot, PlantInPlotVariables } from '@firebasegen/default-connector';

// The `PlantInPlot` mutation requires an argument of type `PlantInPlotVariables`:
const plantInPlotVars: PlantInPlotVariables = {
  plotId: ..., 
  plantId: ..., 
  expectedHarvestDate: ..., // optional
  notes: ..., // optional
};

// Call the `plantInPlot()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await plantInPlot(plantInPlotVars);
// Variables can be defined inline as well.
const { data } = await plantInPlot({ plotId: ..., plantId: ..., expectedHarvestDate: ..., notes: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await plantInPlot(dataConnect, plantInPlotVars);

console.log(data.plantInstance_insert);

// Or, you can use the `Promise` API.
plantInPlot(plantInPlotVars).then((response) => {
  const data = response.data;
  console.log(data.plantInstance_insert);
});
```

### Using `PlantInPlot`'s `MutationRef` function

```javascript
import { getDataConnect, DataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, plantInPlotRef, PlantInPlotVariables } from '@firebasegen/default-connector';

// The `PlantInPlot` mutation requires an argument of type `PlantInPlotVariables`:
const plantInPlotVars: PlantInPlotVariables = {
  plotId: ..., 
  plantId: ..., 
  expectedHarvestDate: ..., // optional
  notes: ..., // optional
};

// Call the `plantInPlotRef()` function to get a reference to the mutation.
const ref = plantInPlotRef(plantInPlotVars);
// Variables can be defined inline as well.
const ref = plantInPlotRef({ plotId: ..., plantId: ..., expectedHarvestDate: ..., notes: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = plantInPlotRef(dataConnect, plantInPlotVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.plantInstance_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.plantInstance_insert);
});
```

## UpdatePlantStatus
You can execute the `UpdatePlantStatus` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [default-connector/index.d.ts](./index.d.ts):
```javascript
updatePlantStatus(vars: UpdatePlantStatusVariables): MutationPromise<UpdatePlantStatusData, UpdatePlantStatusVariables>;

updatePlantStatusRef(vars: UpdatePlantStatusVariables): MutationRef<UpdatePlantStatusData, UpdatePlantStatusVariables>;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```javascript
updatePlantStatus(dc: DataConnect, vars: UpdatePlantStatusVariables): MutationPromise<UpdatePlantStatusData, UpdatePlantStatusVariables>;

updatePlantStatusRef(dc: DataConnect, vars: UpdatePlantStatusVariables): MutationRef<UpdatePlantStatusData, UpdatePlantStatusVariables>;
```

### Variables
The `UpdatePlantStatus` mutation requires an argument of type `UpdatePlantStatusVariables`, which is defined in [default-connector/index.d.ts](./index.d.ts). It has the following fields:

```javascript
export interface UpdatePlantStatusVariables {
  instanceId: UUIDString;
  status: string;
  notes?: string | null;
}
```
### Return Type
Recall that executing the `UpdatePlantStatus` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdatePlantStatusData`, which is defined in [default-connector/index.d.ts](./index.d.ts). It has the following fields:
```javascript
export interface UpdatePlantStatusData {
  plantInstance_update?: PlantInstance_Key | null;
}
```
### Using `UpdatePlantStatus`'s action shortcut function

```javascript
import { getDataConnect, DataConnect } from 'firebase/data-connect';
import { connectorConfig, updatePlantStatus, UpdatePlantStatusVariables } from '@firebasegen/default-connector';

// The `UpdatePlantStatus` mutation requires an argument of type `UpdatePlantStatusVariables`:
const updatePlantStatusVars: UpdatePlantStatusVariables = {
  instanceId: ..., 
  status: ..., 
  notes: ..., // optional
};

// Call the `updatePlantStatus()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updatePlantStatus(updatePlantStatusVars);
// Variables can be defined inline as well.
const { data } = await updatePlantStatus({ instanceId: ..., status: ..., notes: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updatePlantStatus(dataConnect, updatePlantStatusVars);

console.log(data.plantInstance_update);

// Or, you can use the `Promise` API.
updatePlantStatus(updatePlantStatusVars).then((response) => {
  const data = response.data;
  console.log(data.plantInstance_update);
});
```

### Using `UpdatePlantStatus`'s `MutationRef` function

```javascript
import { getDataConnect, DataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updatePlantStatusRef, UpdatePlantStatusVariables } from '@firebasegen/default-connector';

// The `UpdatePlantStatus` mutation requires an argument of type `UpdatePlantStatusVariables`:
const updatePlantStatusVars: UpdatePlantStatusVariables = {
  instanceId: ..., 
  status: ..., 
  notes: ..., // optional
};

// Call the `updatePlantStatusRef()` function to get a reference to the mutation.
const ref = updatePlantStatusRef(updatePlantStatusVars);
// Variables can be defined inline as well.
const ref = updatePlantStatusRef({ instanceId: ..., status: ..., notes: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updatePlantStatusRef(dataConnect, updatePlantStatusVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.plantInstance_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.plantInstance_update);
});
```

## RemovePlant
You can execute the `RemovePlant` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [default-connector/index.d.ts](./index.d.ts):
```javascript
removePlant(vars: RemovePlantVariables): MutationPromise<RemovePlantData, RemovePlantVariables>;

removePlantRef(vars: RemovePlantVariables): MutationRef<RemovePlantData, RemovePlantVariables>;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```javascript
removePlant(dc: DataConnect, vars: RemovePlantVariables): MutationPromise<RemovePlantData, RemovePlantVariables>;

removePlantRef(dc: DataConnect, vars: RemovePlantVariables): MutationRef<RemovePlantData, RemovePlantVariables>;
```

### Variables
The `RemovePlant` mutation requires an argument of type `RemovePlantVariables`, which is defined in [default-connector/index.d.ts](./index.d.ts). It has the following fields:

```javascript
export interface RemovePlantVariables {
  instanceId: UUIDString;
}
```
### Return Type
Recall that executing the `RemovePlant` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `RemovePlantData`, which is defined in [default-connector/index.d.ts](./index.d.ts). It has the following fields:
```javascript
export interface RemovePlantData {
  plantInstance_delete?: PlantInstance_Key | null;
}
```
### Using `RemovePlant`'s action shortcut function

```javascript
import { getDataConnect, DataConnect } from 'firebase/data-connect';
import { connectorConfig, removePlant, RemovePlantVariables } from '@firebasegen/default-connector';

// The `RemovePlant` mutation requires an argument of type `RemovePlantVariables`:
const removePlantVars: RemovePlantVariables = {
  instanceId: ..., 
};

// Call the `removePlant()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await removePlant(removePlantVars);
// Variables can be defined inline as well.
const { data } = await removePlant({ instanceId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await removePlant(dataConnect, removePlantVars);

console.log(data.plantInstance_delete);

// Or, you can use the `Promise` API.
removePlant(removePlantVars).then((response) => {
  const data = response.data;
  console.log(data.plantInstance_delete);
});
```

### Using `RemovePlant`'s `MutationRef` function

```javascript
import { getDataConnect, DataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, removePlantRef, RemovePlantVariables } from '@firebasegen/default-connector';

// The `RemovePlant` mutation requires an argument of type `RemovePlantVariables`:
const removePlantVars: RemovePlantVariables = {
  instanceId: ..., 
};

// Call the `removePlantRef()` function to get a reference to the mutation.
const ref = removePlantRef(removePlantVars);
// Variables can be defined inline as well.
const ref = removePlantRef({ instanceId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = removePlantRef(dataConnect, removePlantVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.plantInstance_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.plantInstance_delete);
});
```

## CreateTask
You can execute the `CreateTask` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [default-connector/index.d.ts](./index.d.ts):
```javascript
createTask(vars: CreateTaskVariables): MutationPromise<CreateTaskData, CreateTaskVariables>;

createTaskRef(vars: CreateTaskVariables): MutationRef<CreateTaskData, CreateTaskVariables>;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```javascript
createTask(dc: DataConnect, vars: CreateTaskVariables): MutationPromise<CreateTaskData, CreateTaskVariables>;

createTaskRef(dc: DataConnect, vars: CreateTaskVariables): MutationRef<CreateTaskData, CreateTaskVariables>;
```

### Variables
The `CreateTask` mutation requires an argument of type `CreateTaskVariables`, which is defined in [default-connector/index.d.ts](./index.d.ts). It has the following fields:

```javascript
export interface CreateTaskVariables {
  title: string;
  description?: string | null;
  category?: string | null;
  priority?: string | null;
  dueDate?: DateString | null;
  assignedToId?: string | null;
  relatedPlotId?: UUIDString | null;
}
```
### Return Type
Recall that executing the `CreateTask` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateTaskData`, which is defined in [default-connector/index.d.ts](./index.d.ts). It has the following fields:
```javascript
export interface CreateTaskData {
  task_insert: Task_Key;
}
```
### Using `CreateTask`'s action shortcut function

```javascript
import { getDataConnect, DataConnect } from 'firebase/data-connect';
import { connectorConfig, createTask, CreateTaskVariables } from '@firebasegen/default-connector';

// The `CreateTask` mutation requires an argument of type `CreateTaskVariables`:
const createTaskVars: CreateTaskVariables = {
  title: ..., 
  description: ..., // optional
  category: ..., // optional
  priority: ..., // optional
  dueDate: ..., // optional
  assignedToId: ..., // optional
  relatedPlotId: ..., // optional
};

// Call the `createTask()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createTask(createTaskVars);
// Variables can be defined inline as well.
const { data } = await createTask({ title: ..., description: ..., category: ..., priority: ..., dueDate: ..., assignedToId: ..., relatedPlotId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createTask(dataConnect, createTaskVars);

console.log(data.task_insert);

// Or, you can use the `Promise` API.
createTask(createTaskVars).then((response) => {
  const data = response.data;
  console.log(data.task_insert);
});
```

### Using `CreateTask`'s `MutationRef` function

```javascript
import { getDataConnect, DataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createTaskRef, CreateTaskVariables } from '@firebasegen/default-connector';

// The `CreateTask` mutation requires an argument of type `CreateTaskVariables`:
const createTaskVars: CreateTaskVariables = {
  title: ..., 
  description: ..., // optional
  category: ..., // optional
  priority: ..., // optional
  dueDate: ..., // optional
  assignedToId: ..., // optional
  relatedPlotId: ..., // optional
};

// Call the `createTaskRef()` function to get a reference to the mutation.
const ref = createTaskRef(createTaskVars);
// Variables can be defined inline as well.
const ref = createTaskRef({ title: ..., description: ..., category: ..., priority: ..., dueDate: ..., assignedToId: ..., relatedPlotId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createTaskRef(dataConnect, createTaskVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.task_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.task_insert);
});
```

## UpdateTask
You can execute the `UpdateTask` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [default-connector/index.d.ts](./index.d.ts):
```javascript
updateTask(vars: UpdateTaskVariables): MutationPromise<UpdateTaskData, UpdateTaskVariables>;

updateTaskRef(vars: UpdateTaskVariables): MutationRef<UpdateTaskData, UpdateTaskVariables>;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```javascript
updateTask(dc: DataConnect, vars: UpdateTaskVariables): MutationPromise<UpdateTaskData, UpdateTaskVariables>;

updateTaskRef(dc: DataConnect, vars: UpdateTaskVariables): MutationRef<UpdateTaskData, UpdateTaskVariables>;
```

### Variables
The `UpdateTask` mutation requires an argument of type `UpdateTaskVariables`, which is defined in [default-connector/index.d.ts](./index.d.ts). It has the following fields:

```javascript
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
```
### Return Type
Recall that executing the `UpdateTask` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateTaskData`, which is defined in [default-connector/index.d.ts](./index.d.ts). It has the following fields:
```javascript
export interface UpdateTaskData {
  task_update?: Task_Key | null;
}
```
### Using `UpdateTask`'s action shortcut function

```javascript
import { getDataConnect, DataConnect } from 'firebase/data-connect';
import { connectorConfig, updateTask, UpdateTaskVariables } from '@firebasegen/default-connector';

// The `UpdateTask` mutation requires an argument of type `UpdateTaskVariables`:
const updateTaskVars: UpdateTaskVariables = {
  taskId: ..., 
  title: ..., // optional
  description: ..., // optional
  category: ..., // optional
  priority: ..., // optional
  status: ..., // optional
  dueDate: ..., // optional
  assignedToId: ..., // optional
  relatedPlotId: ..., // optional
};

// Call the `updateTask()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateTask(updateTaskVars);
// Variables can be defined inline as well.
const { data } = await updateTask({ taskId: ..., title: ..., description: ..., category: ..., priority: ..., status: ..., dueDate: ..., assignedToId: ..., relatedPlotId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateTask(dataConnect, updateTaskVars);

console.log(data.task_update);

// Or, you can use the `Promise` API.
updateTask(updateTaskVars).then((response) => {
  const data = response.data;
  console.log(data.task_update);
});
```

### Using `UpdateTask`'s `MutationRef` function

```javascript
import { getDataConnect, DataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateTaskRef, UpdateTaskVariables } from '@firebasegen/default-connector';

// The `UpdateTask` mutation requires an argument of type `UpdateTaskVariables`:
const updateTaskVars: UpdateTaskVariables = {
  taskId: ..., 
  title: ..., // optional
  description: ..., // optional
  category: ..., // optional
  priority: ..., // optional
  status: ..., // optional
  dueDate: ..., // optional
  assignedToId: ..., // optional
  relatedPlotId: ..., // optional
};

// Call the `updateTaskRef()` function to get a reference to the mutation.
const ref = updateTaskRef(updateTaskVars);
// Variables can be defined inline as well.
const ref = updateTaskRef({ taskId: ..., title: ..., description: ..., category: ..., priority: ..., status: ..., dueDate: ..., assignedToId: ..., relatedPlotId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateTaskRef(dataConnect, updateTaskVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.task_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.task_update);
});
```

## CompleteTask
You can execute the `CompleteTask` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [default-connector/index.d.ts](./index.d.ts):
```javascript
completeTask(vars: CompleteTaskVariables): MutationPromise<CompleteTaskData, CompleteTaskVariables>;

completeTaskRef(vars: CompleteTaskVariables): MutationRef<CompleteTaskData, CompleteTaskVariables>;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```javascript
completeTask(dc: DataConnect, vars: CompleteTaskVariables): MutationPromise<CompleteTaskData, CompleteTaskVariables>;

completeTaskRef(dc: DataConnect, vars: CompleteTaskVariables): MutationRef<CompleteTaskData, CompleteTaskVariables>;
```

### Variables
The `CompleteTask` mutation requires an argument of type `CompleteTaskVariables`, which is defined in [default-connector/index.d.ts](./index.d.ts). It has the following fields:

```javascript
export interface CompleteTaskVariables {
  taskId: UUIDString;
}
```
### Return Type
Recall that executing the `CompleteTask` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CompleteTaskData`, which is defined in [default-connector/index.d.ts](./index.d.ts). It has the following fields:
```javascript
export interface CompleteTaskData {
  task_update?: Task_Key | null;
}
```
### Using `CompleteTask`'s action shortcut function

```javascript
import { getDataConnect, DataConnect } from 'firebase/data-connect';
import { connectorConfig, completeTask, CompleteTaskVariables } from '@firebasegen/default-connector';

// The `CompleteTask` mutation requires an argument of type `CompleteTaskVariables`:
const completeTaskVars: CompleteTaskVariables = {
  taskId: ..., 
};

// Call the `completeTask()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await completeTask(completeTaskVars);
// Variables can be defined inline as well.
const { data } = await completeTask({ taskId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await completeTask(dataConnect, completeTaskVars);

console.log(data.task_update);

// Or, you can use the `Promise` API.
completeTask(completeTaskVars).then((response) => {
  const data = response.data;
  console.log(data.task_update);
});
```

### Using `CompleteTask`'s `MutationRef` function

```javascript
import { getDataConnect, DataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, completeTaskRef, CompleteTaskVariables } from '@firebasegen/default-connector';

// The `CompleteTask` mutation requires an argument of type `CompleteTaskVariables`:
const completeTaskVars: CompleteTaskVariables = {
  taskId: ..., 
};

// Call the `completeTaskRef()` function to get a reference to the mutation.
const ref = completeTaskRef(completeTaskVars);
// Variables can be defined inline as well.
const ref = completeTaskRef({ taskId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = completeTaskRef(dataConnect, completeTaskVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.task_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.task_update);
});
```

## DeleteTask
You can execute the `DeleteTask` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [default-connector/index.d.ts](./index.d.ts):
```javascript
deleteTask(vars: DeleteTaskVariables): MutationPromise<DeleteTaskData, DeleteTaskVariables>;

deleteTaskRef(vars: DeleteTaskVariables): MutationRef<DeleteTaskData, DeleteTaskVariables>;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```javascript
deleteTask(dc: DataConnect, vars: DeleteTaskVariables): MutationPromise<DeleteTaskData, DeleteTaskVariables>;

deleteTaskRef(dc: DataConnect, vars: DeleteTaskVariables): MutationRef<DeleteTaskData, DeleteTaskVariables>;
```

### Variables
The `DeleteTask` mutation requires an argument of type `DeleteTaskVariables`, which is defined in [default-connector/index.d.ts](./index.d.ts). It has the following fields:

```javascript
export interface DeleteTaskVariables {
  taskId: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteTask` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteTaskData`, which is defined in [default-connector/index.d.ts](./index.d.ts). It has the following fields:
```javascript
export interface DeleteTaskData {
  task_delete?: Task_Key | null;
}
```
### Using `DeleteTask`'s action shortcut function

```javascript
import { getDataConnect, DataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteTask, DeleteTaskVariables } from '@firebasegen/default-connector';

// The `DeleteTask` mutation requires an argument of type `DeleteTaskVariables`:
const deleteTaskVars: DeleteTaskVariables = {
  taskId: ..., 
};

// Call the `deleteTask()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteTask(deleteTaskVars);
// Variables can be defined inline as well.
const { data } = await deleteTask({ taskId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteTask(dataConnect, deleteTaskVars);

console.log(data.task_delete);

// Or, you can use the `Promise` API.
deleteTask(deleteTaskVars).then((response) => {
  const data = response.data;
  console.log(data.task_delete);
});
```

### Using `DeleteTask`'s `MutationRef` function

```javascript
import { getDataConnect, DataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteTaskRef, DeleteTaskVariables } from '@firebasegen/default-connector';

// The `DeleteTask` mutation requires an argument of type `DeleteTaskVariables`:
const deleteTaskVars: DeleteTaskVariables = {
  taskId: ..., 
};

// Call the `deleteTaskRef()` function to get a reference to the mutation.
const ref = deleteTaskRef(deleteTaskVars);
// Variables can be defined inline as well.
const ref = deleteTaskRef({ taskId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteTaskRef(dataConnect, deleteTaskVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.task_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.task_delete);
});
```

## CreateEvent
You can execute the `CreateEvent` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [default-connector/index.d.ts](./index.d.ts):
```javascript
createEvent(vars: CreateEventVariables): MutationPromise<CreateEventData, CreateEventVariables>;

createEventRef(vars: CreateEventVariables): MutationRef<CreateEventData, CreateEventVariables>;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```javascript
createEvent(dc: DataConnect, vars: CreateEventVariables): MutationPromise<CreateEventData, CreateEventVariables>;

createEventRef(dc: DataConnect, vars: CreateEventVariables): MutationRef<CreateEventData, CreateEventVariables>;
```

### Variables
The `CreateEvent` mutation requires an argument of type `CreateEventVariables`, which is defined in [default-connector/index.d.ts](./index.d.ts). It has the following fields:

```javascript
export interface CreateEventVariables {
  title: string;
  description?: string | null;
  startTime: TimestampString;
  endTime: TimestampString;
  location?: string | null;
  eventType?: string | null;
  maxAttendees?: number | null;
}
```
### Return Type
Recall that executing the `CreateEvent` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateEventData`, which is defined in [default-connector/index.d.ts](./index.d.ts). It has the following fields:
```javascript
export interface CreateEventData {
  event_insert: Event_Key;
}
```
### Using `CreateEvent`'s action shortcut function

```javascript
import { getDataConnect, DataConnect } from 'firebase/data-connect';
import { connectorConfig, createEvent, CreateEventVariables } from '@firebasegen/default-connector';

// The `CreateEvent` mutation requires an argument of type `CreateEventVariables`:
const createEventVars: CreateEventVariables = {
  title: ..., 
  description: ..., // optional
  startTime: ..., 
  endTime: ..., 
  location: ..., // optional
  eventType: ..., // optional
  maxAttendees: ..., // optional
};

// Call the `createEvent()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createEvent(createEventVars);
// Variables can be defined inline as well.
const { data } = await createEvent({ title: ..., description: ..., startTime: ..., endTime: ..., location: ..., eventType: ..., maxAttendees: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createEvent(dataConnect, createEventVars);

console.log(data.event_insert);

// Or, you can use the `Promise` API.
createEvent(createEventVars).then((response) => {
  const data = response.data;
  console.log(data.event_insert);
});
```

### Using `CreateEvent`'s `MutationRef` function

```javascript
import { getDataConnect, DataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createEventRef, CreateEventVariables } from '@firebasegen/default-connector';

// The `CreateEvent` mutation requires an argument of type `CreateEventVariables`:
const createEventVars: CreateEventVariables = {
  title: ..., 
  description: ..., // optional
  startTime: ..., 
  endTime: ..., 
  location: ..., // optional
  eventType: ..., // optional
  maxAttendees: ..., // optional
};

// Call the `createEventRef()` function to get a reference to the mutation.
const ref = createEventRef(createEventVars);
// Variables can be defined inline as well.
const ref = createEventRef({ title: ..., description: ..., startTime: ..., endTime: ..., location: ..., eventType: ..., maxAttendees: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createEventRef(dataConnect, createEventVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.event_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.event_insert);
});
```

## UpdateEvent
You can execute the `UpdateEvent` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [default-connector/index.d.ts](./index.d.ts):
```javascript
updateEvent(vars: UpdateEventVariables): MutationPromise<UpdateEventData, UpdateEventVariables>;

updateEventRef(vars: UpdateEventVariables): MutationRef<UpdateEventData, UpdateEventVariables>;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```javascript
updateEvent(dc: DataConnect, vars: UpdateEventVariables): MutationPromise<UpdateEventData, UpdateEventVariables>;

updateEventRef(dc: DataConnect, vars: UpdateEventVariables): MutationRef<UpdateEventData, UpdateEventVariables>;
```

### Variables
The `UpdateEvent` mutation requires an argument of type `UpdateEventVariables`, which is defined in [default-connector/index.d.ts](./index.d.ts). It has the following fields:

```javascript
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
```
### Return Type
Recall that executing the `UpdateEvent` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateEventData`, which is defined in [default-connector/index.d.ts](./index.d.ts). It has the following fields:
```javascript
export interface UpdateEventData {
  event_update?: Event_Key | null;
}
```
### Using `UpdateEvent`'s action shortcut function

```javascript
import { getDataConnect, DataConnect } from 'firebase/data-connect';
import { connectorConfig, updateEvent, UpdateEventVariables } from '@firebasegen/default-connector';

// The `UpdateEvent` mutation requires an argument of type `UpdateEventVariables`:
const updateEventVars: UpdateEventVariables = {
  eventId: ..., 
  title: ..., // optional
  description: ..., // optional
  startTime: ..., // optional
  endTime: ..., // optional
  location: ..., // optional
  eventType: ..., // optional
  maxAttendees: ..., // optional
};

// Call the `updateEvent()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateEvent(updateEventVars);
// Variables can be defined inline as well.
const { data } = await updateEvent({ eventId: ..., title: ..., description: ..., startTime: ..., endTime: ..., location: ..., eventType: ..., maxAttendees: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateEvent(dataConnect, updateEventVars);

console.log(data.event_update);

// Or, you can use the `Promise` API.
updateEvent(updateEventVars).then((response) => {
  const data = response.data;
  console.log(data.event_update);
});
```

### Using `UpdateEvent`'s `MutationRef` function

```javascript
import { getDataConnect, DataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateEventRef, UpdateEventVariables } from '@firebasegen/default-connector';

// The `UpdateEvent` mutation requires an argument of type `UpdateEventVariables`:
const updateEventVars: UpdateEventVariables = {
  eventId: ..., 
  title: ..., // optional
  description: ..., // optional
  startTime: ..., // optional
  endTime: ..., // optional
  location: ..., // optional
  eventType: ..., // optional
  maxAttendees: ..., // optional
};

// Call the `updateEventRef()` function to get a reference to the mutation.
const ref = updateEventRef(updateEventVars);
// Variables can be defined inline as well.
const ref = updateEventRef({ eventId: ..., title: ..., description: ..., startTime: ..., endTime: ..., location: ..., eventType: ..., maxAttendees: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateEventRef(dataConnect, updateEventVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.event_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.event_update);
});
```

## RsvpToEvent
You can execute the `RsvpToEvent` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [default-connector/index.d.ts](./index.d.ts):
```javascript
rsvpToEvent(vars: RsvpToEventVariables): MutationPromise<RsvpToEventData, RsvpToEventVariables>;

rsvpToEventRef(vars: RsvpToEventVariables): MutationRef<RsvpToEventData, RsvpToEventVariables>;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```javascript
rsvpToEvent(dc: DataConnect, vars: RsvpToEventVariables): MutationPromise<RsvpToEventData, RsvpToEventVariables>;

rsvpToEventRef(dc: DataConnect, vars: RsvpToEventVariables): MutationRef<RsvpToEventData, RsvpToEventVariables>;
```

### Variables
The `RsvpToEvent` mutation requires an argument of type `RsvpToEventVariables`, which is defined in [default-connector/index.d.ts](./index.d.ts). It has the following fields:

```javascript
export interface RsvpToEventVariables {
  eventId: UUIDString;
  status: string;
}
```
### Return Type
Recall that executing the `RsvpToEvent` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `RsvpToEventData`, which is defined in [default-connector/index.d.ts](./index.d.ts). It has the following fields:
```javascript
export interface RsvpToEventData {
  eventAttendee_upsert: EventAttendee_Key;
}
```
### Using `RsvpToEvent`'s action shortcut function

```javascript
import { getDataConnect, DataConnect } from 'firebase/data-connect';
import { connectorConfig, rsvpToEvent, RsvpToEventVariables } from '@firebasegen/default-connector';

// The `RsvpToEvent` mutation requires an argument of type `RsvpToEventVariables`:
const rsvpToEventVars: RsvpToEventVariables = {
  eventId: ..., 
  status: ..., 
};

// Call the `rsvpToEvent()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await rsvpToEvent(rsvpToEventVars);
// Variables can be defined inline as well.
const { data } = await rsvpToEvent({ eventId: ..., status: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await rsvpToEvent(dataConnect, rsvpToEventVars);

console.log(data.eventAttendee_upsert);

// Or, you can use the `Promise` API.
rsvpToEvent(rsvpToEventVars).then((response) => {
  const data = response.data;
  console.log(data.eventAttendee_upsert);
});
```

### Using `RsvpToEvent`'s `MutationRef` function

```javascript
import { getDataConnect, DataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, rsvpToEventRef, RsvpToEventVariables } from '@firebasegen/default-connector';

// The `RsvpToEvent` mutation requires an argument of type `RsvpToEventVariables`:
const rsvpToEventVars: RsvpToEventVariables = {
  eventId: ..., 
  status: ..., 
};

// Call the `rsvpToEventRef()` function to get a reference to the mutation.
const ref = rsvpToEventRef(rsvpToEventVars);
// Variables can be defined inline as well.
const ref = rsvpToEventRef({ eventId: ..., status: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = rsvpToEventRef(dataConnect, rsvpToEventVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.eventAttendee_upsert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.eventAttendee_upsert);
});
```

## CancelEvent
You can execute the `CancelEvent` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [default-connector/index.d.ts](./index.d.ts):
```javascript
cancelEvent(vars: CancelEventVariables): MutationPromise<CancelEventData, CancelEventVariables>;

cancelEventRef(vars: CancelEventVariables): MutationRef<CancelEventData, CancelEventVariables>;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```javascript
cancelEvent(dc: DataConnect, vars: CancelEventVariables): MutationPromise<CancelEventData, CancelEventVariables>;

cancelEventRef(dc: DataConnect, vars: CancelEventVariables): MutationRef<CancelEventData, CancelEventVariables>;
```

### Variables
The `CancelEvent` mutation requires an argument of type `CancelEventVariables`, which is defined in [default-connector/index.d.ts](./index.d.ts). It has the following fields:

```javascript
export interface CancelEventVariables {
  eventId: UUIDString;
}
```
### Return Type
Recall that executing the `CancelEvent` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CancelEventData`, which is defined in [default-connector/index.d.ts](./index.d.ts). It has the following fields:
```javascript
export interface CancelEventData {
  event_delete?: Event_Key | null;
}
```
### Using `CancelEvent`'s action shortcut function

```javascript
import { getDataConnect, DataConnect } from 'firebase/data-connect';
import { connectorConfig, cancelEvent, CancelEventVariables } from '@firebasegen/default-connector';

// The `CancelEvent` mutation requires an argument of type `CancelEventVariables`:
const cancelEventVars: CancelEventVariables = {
  eventId: ..., 
};

// Call the `cancelEvent()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await cancelEvent(cancelEventVars);
// Variables can be defined inline as well.
const { data } = await cancelEvent({ eventId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await cancelEvent(dataConnect, cancelEventVars);

console.log(data.event_delete);

// Or, you can use the `Promise` API.
cancelEvent(cancelEventVars).then((response) => {
  const data = response.data;
  console.log(data.event_delete);
});
```

### Using `CancelEvent`'s `MutationRef` function

```javascript
import { getDataConnect, DataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, cancelEventRef, CancelEventVariables } from '@firebasegen/default-connector';

// The `CancelEvent` mutation requires an argument of type `CancelEventVariables`:
const cancelEventVars: CancelEventVariables = {
  eventId: ..., 
};

// Call the `cancelEventRef()` function to get a reference to the mutation.
const ref = cancelEventRef(cancelEventVars);
// Variables can be defined inline as well.
const ref = cancelEventRef({ eventId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = cancelEventRef(dataConnect, cancelEventVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.event_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.event_delete);
});
```

## CreateResource
You can execute the `CreateResource` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [default-connector/index.d.ts](./index.d.ts):
```javascript
createResource(vars: CreateResourceVariables): MutationPromise<CreateResourceData, CreateResourceVariables>;

createResourceRef(vars: CreateResourceVariables): MutationRef<CreateResourceData, CreateResourceVariables>;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```javascript
createResource(dc: DataConnect, vars: CreateResourceVariables): MutationPromise<CreateResourceData, CreateResourceVariables>;

createResourceRef(dc: DataConnect, vars: CreateResourceVariables): MutationRef<CreateResourceData, CreateResourceVariables>;
```

### Variables
The `CreateResource` mutation requires an argument of type `CreateResourceVariables`, which is defined in [default-connector/index.d.ts](./index.d.ts). It has the following fields:

```javascript
export interface CreateResourceVariables {
  title: string;
  content: string;
  category: string;
  tags?: string | null;
  imageUrl?: string | null;
}
```
### Return Type
Recall that executing the `CreateResource` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateResourceData`, which is defined in [default-connector/index.d.ts](./index.d.ts). It has the following fields:
```javascript
export interface CreateResourceData {
  resource_insert: Resource_Key;
}
```
### Using `CreateResource`'s action shortcut function

```javascript
import { getDataConnect, DataConnect } from 'firebase/data-connect';
import { connectorConfig, createResource, CreateResourceVariables } from '@firebasegen/default-connector';

// The `CreateResource` mutation requires an argument of type `CreateResourceVariables`:
const createResourceVars: CreateResourceVariables = {
  title: ..., 
  content: ..., 
  category: ..., 
  tags: ..., // optional
  imageUrl: ..., // optional
};

// Call the `createResource()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createResource(createResourceVars);
// Variables can be defined inline as well.
const { data } = await createResource({ title: ..., content: ..., category: ..., tags: ..., imageUrl: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createResource(dataConnect, createResourceVars);

console.log(data.resource_insert);

// Or, you can use the `Promise` API.
createResource(createResourceVars).then((response) => {
  const data = response.data;
  console.log(data.resource_insert);
});
```

### Using `CreateResource`'s `MutationRef` function

```javascript
import { getDataConnect, DataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createResourceRef, CreateResourceVariables } from '@firebasegen/default-connector';

// The `CreateResource` mutation requires an argument of type `CreateResourceVariables`:
const createResourceVars: CreateResourceVariables = {
  title: ..., 
  content: ..., 
  category: ..., 
  tags: ..., // optional
  imageUrl: ..., // optional
};

// Call the `createResourceRef()` function to get a reference to the mutation.
const ref = createResourceRef(createResourceVars);
// Variables can be defined inline as well.
const ref = createResourceRef({ title: ..., content: ..., category: ..., tags: ..., imageUrl: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createResourceRef(dataConnect, createResourceVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.resource_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.resource_insert);
});
```

## UpdateResource
You can execute the `UpdateResource` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [default-connector/index.d.ts](./index.d.ts):
```javascript
updateResource(vars: UpdateResourceVariables): MutationPromise<UpdateResourceData, UpdateResourceVariables>;

updateResourceRef(vars: UpdateResourceVariables): MutationRef<UpdateResourceData, UpdateResourceVariables>;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```javascript
updateResource(dc: DataConnect, vars: UpdateResourceVariables): MutationPromise<UpdateResourceData, UpdateResourceVariables>;

updateResourceRef(dc: DataConnect, vars: UpdateResourceVariables): MutationRef<UpdateResourceData, UpdateResourceVariables>;
```

### Variables
The `UpdateResource` mutation requires an argument of type `UpdateResourceVariables`, which is defined in [default-connector/index.d.ts](./index.d.ts). It has the following fields:

```javascript
export interface UpdateResourceVariables {
  resourceId: UUIDString;
  title?: string | null;
  content?: string | null;
  category?: string | null;
  tags?: string | null;
  imageUrl?: string | null;
}
```
### Return Type
Recall that executing the `UpdateResource` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateResourceData`, which is defined in [default-connector/index.d.ts](./index.d.ts). It has the following fields:
```javascript
export interface UpdateResourceData {
  resource_update?: Resource_Key | null;
}
```
### Using `UpdateResource`'s action shortcut function

```javascript
import { getDataConnect, DataConnect } from 'firebase/data-connect';
import { connectorConfig, updateResource, UpdateResourceVariables } from '@firebasegen/default-connector';

// The `UpdateResource` mutation requires an argument of type `UpdateResourceVariables`:
const updateResourceVars: UpdateResourceVariables = {
  resourceId: ..., 
  title: ..., // optional
  content: ..., // optional
  category: ..., // optional
  tags: ..., // optional
  imageUrl: ..., // optional
};

// Call the `updateResource()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateResource(updateResourceVars);
// Variables can be defined inline as well.
const { data } = await updateResource({ resourceId: ..., title: ..., content: ..., category: ..., tags: ..., imageUrl: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateResource(dataConnect, updateResourceVars);

console.log(data.resource_update);

// Or, you can use the `Promise` API.
updateResource(updateResourceVars).then((response) => {
  const data = response.data;
  console.log(data.resource_update);
});
```

### Using `UpdateResource`'s `MutationRef` function

```javascript
import { getDataConnect, DataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateResourceRef, UpdateResourceVariables } from '@firebasegen/default-connector';

// The `UpdateResource` mutation requires an argument of type `UpdateResourceVariables`:
const updateResourceVars: UpdateResourceVariables = {
  resourceId: ..., 
  title: ..., // optional
  content: ..., // optional
  category: ..., // optional
  tags: ..., // optional
  imageUrl: ..., // optional
};

// Call the `updateResourceRef()` function to get a reference to the mutation.
const ref = updateResourceRef(updateResourceVars);
// Variables can be defined inline as well.
const ref = updateResourceRef({ resourceId: ..., title: ..., content: ..., category: ..., tags: ..., imageUrl: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateResourceRef(dataConnect, updateResourceVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.resource_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.resource_update);
});
```

## DeleteResource
You can execute the `DeleteResource` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [default-connector/index.d.ts](./index.d.ts):
```javascript
deleteResource(vars: DeleteResourceVariables): MutationPromise<DeleteResourceData, DeleteResourceVariables>;

deleteResourceRef(vars: DeleteResourceVariables): MutationRef<DeleteResourceData, DeleteResourceVariables>;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```javascript
deleteResource(dc: DataConnect, vars: DeleteResourceVariables): MutationPromise<DeleteResourceData, DeleteResourceVariables>;

deleteResourceRef(dc: DataConnect, vars: DeleteResourceVariables): MutationRef<DeleteResourceData, DeleteResourceVariables>;
```

### Variables
The `DeleteResource` mutation requires an argument of type `DeleteResourceVariables`, which is defined in [default-connector/index.d.ts](./index.d.ts). It has the following fields:

```javascript
export interface DeleteResourceVariables {
  resourceId: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteResource` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteResourceData`, which is defined in [default-connector/index.d.ts](./index.d.ts). It has the following fields:
```javascript
export interface DeleteResourceData {
  resource_delete?: Resource_Key | null;
}
```
### Using `DeleteResource`'s action shortcut function

```javascript
import { getDataConnect, DataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteResource, DeleteResourceVariables } from '@firebasegen/default-connector';

// The `DeleteResource` mutation requires an argument of type `DeleteResourceVariables`:
const deleteResourceVars: DeleteResourceVariables = {
  resourceId: ..., 
};

// Call the `deleteResource()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteResource(deleteResourceVars);
// Variables can be defined inline as well.
const { data } = await deleteResource({ resourceId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteResource(dataConnect, deleteResourceVars);

console.log(data.resource_delete);

// Or, you can use the `Promise` API.
deleteResource(deleteResourceVars).then((response) => {
  const data = response.data;
  console.log(data.resource_delete);
});
```

### Using `DeleteResource`'s `MutationRef` function

```javascript
import { getDataConnect, DataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteResourceRef, DeleteResourceVariables } from '@firebasegen/default-connector';

// The `DeleteResource` mutation requires an argument of type `DeleteResourceVariables`:
const deleteResourceVars: DeleteResourceVariables = {
  resourceId: ..., 
};

// Call the `deleteResourceRef()` function to get a reference to the mutation.
const ref = deleteResourceRef(deleteResourceVars);
// Variables can be defined inline as well.
const ref = deleteResourceRef({ resourceId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteResourceRef(dataConnect, deleteResourceVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.resource_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.resource_delete);
});
```

## RecordWeather
You can execute the `RecordWeather` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [default-connector/index.d.ts](./index.d.ts):
```javascript
recordWeather(vars?: RecordWeatherVariables): MutationPromise<RecordWeatherData, RecordWeatherVariables>;

recordWeatherRef(vars?: RecordWeatherVariables): MutationRef<RecordWeatherData, RecordWeatherVariables>;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```javascript
recordWeather(dc: DataConnect, vars?: RecordWeatherVariables): MutationPromise<RecordWeatherData, RecordWeatherVariables>;

recordWeatherRef(dc: DataConnect, vars?: RecordWeatherVariables): MutationRef<RecordWeatherData, RecordWeatherVariables>;
```

### Variables
The `RecordWeather` mutation has an optional argument of type `RecordWeatherVariables`, which is defined in [default-connector/index.d.ts](./index.d.ts). It has the following fields:

```javascript
export interface RecordWeatherVariables {
  temperature?: number | null;
  humidity?: number | null;
  rainfall?: number | null;
  notes?: string | null;
}
```
### Return Type
Recall that executing the `RecordWeather` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `RecordWeatherData`, which is defined in [default-connector/index.d.ts](./index.d.ts). It has the following fields:
```javascript
export interface RecordWeatherData {
  weatherRecord_insert: WeatherRecord_Key;
}
```
### Using `RecordWeather`'s action shortcut function

```javascript
import { getDataConnect, DataConnect } from 'firebase/data-connect';
import { connectorConfig, recordWeather, RecordWeatherVariables } from '@firebasegen/default-connector';

// The `RecordWeather` mutation has an optional argument of type `RecordWeatherVariables`:
const recordWeatherVars: RecordWeatherVariables = {
  temperature: ..., // optional
  humidity: ..., // optional
  rainfall: ..., // optional
  notes: ..., // optional
};

// Call the `recordWeather()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await recordWeather(recordWeatherVars);
// Variables can be defined inline as well.
const { data } = await recordWeather({ temperature: ..., humidity: ..., rainfall: ..., notes: ..., });
// Since all variables are optional for this mutation, you can omit the `RecordWeatherVariables` argument.
const { data } = await recordWeather();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await recordWeather(dataConnect, recordWeatherVars);

console.log(data.weatherRecord_insert);

// Or, you can use the `Promise` API.
recordWeather(recordWeatherVars).then((response) => {
  const data = response.data;
  console.log(data.weatherRecord_insert);
});
```

### Using `RecordWeather`'s `MutationRef` function

```javascript
import { getDataConnect, DataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, recordWeatherRef, RecordWeatherVariables } from '@firebasegen/default-connector';

// The `RecordWeather` mutation has an optional argument of type `RecordWeatherVariables`:
const recordWeatherVars: RecordWeatherVariables = {
  temperature: ..., // optional
  humidity: ..., // optional
  rainfall: ..., // optional
  notes: ..., // optional
};

// Call the `recordWeatherRef()` function to get a reference to the mutation.
const ref = recordWeatherRef(recordWeatherVars);
// Variables can be defined inline as well.
const ref = recordWeatherRef({ temperature: ..., humidity: ..., rainfall: ..., notes: ..., });
// Since all variables are optional for this mutation, you can omit the `RecordWeatherVariables` argument.
const ref = recordWeatherRef();

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = recordWeatherRef(dataConnect, recordWeatherVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.weatherRecord_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.weatherRecord_insert);
});
```

