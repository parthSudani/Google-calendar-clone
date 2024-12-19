import React, { useState,useEffect } from 'react';

import { ScheduleComponent, Inject, Day, Week, Month,Agenda,EventSettingsModel,DragAndDrop, WorkWeek, ViewsDirective, ViewDirective} from '@syncfusion/ej2-react-schedule';

type EventData = {
  Id: number;
  Subject: string;
  StartTime: Date;
  EndTime: Date;
  _id: string;
};

const App = () => {
  const [eventData, setEventData] = useState<EventData[]>([]);
  const [eventSettings, setEventSettings] = useState<EventSettingsModel>({ dataSource: [] });
  const loadEventsFromAPI = () => {
    fetch('http://localhost:8000/events')
      .then((response) => response.json())
      .then((data) => {
        setEventSettings({ dataSource: data });
      })
      .catch((error) => {
        console.error('Error loading events:', error);
      });
  };

  useEffect(() => {
    loadEventsFromAPI();
  }, []);

  const handleCreateEvent = (eventData: EventData) => {
    fetch('http://localhost:8000/events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventData),
    })
      .then((response) => response.json())
      .then((newEvent) => {
        setEventData((prevEventData) => [...prevEventData, newEvent as EventData]);
      })
      .catch((error) => {
        console.error('Error creating event:', error);
      });
  };
  
  const handleDeleteEvent = (eventData: EventData[]) => {
    fetch(`http://localhost:8000/events/${eventData[0]?.Id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((newEvent) => {
        console.log('Event deleted:', newEvent);
      })
      .catch((error) => {
        console.error('Error deleting event:', error);
      });
  };
  
  const handleUpdateEvent = (eventData: EventData[]) => {
    console.log("event updated called");
    const { _id, ...updatedEventData } = eventData[0];
    fetch(`http://localhost:8000/events/${eventData[0]?.Id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedEventData),
    })
      .then((response) => response.json())
      .then((updatedEvent) => {
        console.log('Event updated:', updatedEvent);
      })
      .catch((error) => {
        console.error('Error updating event:', error);
      });
  };

  
  return (
    <div>
      <ScheduleComponent
      height='550px'
      currentView='Month'
      selectedDate={new Date()}
      eventSettings={eventSettings}
        actionComplete={(args) => {
          console.log("args--------->",args);
          if (args.requestType == 'eventCreated') {
            console.log("88888888888888888")
            handleCreateEvent(args.data as EventData);
          }
          if(args.requestType =='eventRemoved'){
            console.log("remove event called");
            handleDeleteEvent(args.data as EventData[]);
          }
          if(args.requestType =='eventChanged'){
            console.log("remove updated called");
            handleUpdateEvent(args.data as EventData[]);
          }
        }}
      >
        <ViewsDirective>
          <ViewDirective option='Day' interval={3}></ViewDirective>
          <ViewDirective option='Week'></ViewDirective>
          <ViewDirective option='WorkWeek'></ViewDirective>
          <ViewDirective option='Month'></ViewDirective>
          <ViewDirective option='Agenda'></ViewDirective>
        </ViewsDirective>
        <Inject services={[Day, Week,WorkWeek, Month,Agenda,DragAndDrop]} />
      </ScheduleComponent>
    </div>
  );
};

export default App;
