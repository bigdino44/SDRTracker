import React, { useState } from 'react';
import { format, addDays, startOfWeek, addWeeks, isSameDay, parseISO } from 'date-fns';
import { CalendarDays, ChevronLeft, ChevronRight, Clock, Users, Globe, Video } from 'lucide-react';
import { useStore } from '../store/useStore';
import toast from 'react-hot-toast';

interface Meeting {
  id: string;
  title: string;
  date: Date;
  time: string;
  type: 'qualification' | 'demo' | 'follow-up';
  company: string;
  location: 'in-person' | 'video' | 'phone';
  attendees?: string[];
  notes?: string;
}

const Calendar: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentWeek, setCurrentWeek] = useState(startOfWeek(new Date()));
  const { meetings, addMeeting } = useStore((state) => ({
    meetings: state.meetings,
    addMeeting: state.addMeeting,
  }));

  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [newMeeting, setNewMeeting] = useState({
    title: '',
    time: '09:00',
    type: 'qualification',
    company: '',
    location: 'video',
    attendees: '',
    notes: '',
  });

  const timeSlots = Array.from({ length: 9 }, (_, i) => {
    const hour = 9 + i;
    return `${hour.toString().padStart(2, '0')}:00`;
  });

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(currentWeek, i));

  const handlePrevWeek = () => setCurrentWeek(addWeeks(currentWeek, -1));
  const handleNextWeek = () => setCurrentWeek(addWeeks(currentWeek, 1));

  const getMeetingsForDateAndTime = (date: Date, time: string) => {
    return meetings.filter(
      (meeting) =>
        isSameDay(meeting.date, date) && meeting.time === time
    );
  };

  const getLocationIcon = (location: string) => {
    switch (location) {
      case 'in-person':
        return <Users className="h-4 w-4 text-blue-500" />;
      case 'video':
        return <Video className="h-4 w-4 text-purple-500" />;
      default:
        return <Globe className="h-4 w-4 text-green-500" />;
    }
  };

  const handleScheduleMeeting = () => {
    if (!newMeeting.title || !newMeeting.company) {
      toast.error('Please fill in all required fields');
      return;
    }

    const meetingData = {
      ...newMeeting,
      date: selectedDate,
      id: Date.now().toString(),
      attendees: newMeeting.attendees.split(',').map(a => a.trim()).filter(Boolean),
    };

    addMeeting(meetingData);

    // Add to calendar if available
    if ('google' in window) {
      const calendarEvent = {
        summary: meetingData.title,
        location: meetingData.location,
        description: `Meeting with ${meetingData.company}\n\nNotes: ${meetingData.notes}`,
        start: {
          dateTime: `${format(selectedDate, 'yyyy-MM-dd')}T${meetingData.time}:00`,
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
        end: {
          dateTime: `${format(selectedDate, 'yyyy-MM-dd')}T${
            format(addDays(parseISO(`${format(selectedDate, 'yyyy-MM-dd')}T${meetingData.time}:00`), 1), 'HH:mm')
          }:00`,
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
        attendees: meetingData.attendees.map(email => ({ email })),
        reminders: {
          useDefault: true,
        },
      };

      // Google Calendar API call would go here
      console.log('Calendar event:', calendarEvent);
    }

    toast.success('Meeting scheduled successfully!');
    setShowScheduleForm(false);
    setNewMeeting({
      title: '',
      time: '09:00',
      type: 'qualification',
      company: '',
      location: 'video',
      attendees: '',
      notes: '',
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <CalendarDays className="h-6 w-6 text-indigo-600" />
            <h2 className="text-2xl font-bold text-gray-800">Schedule</h2>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={handlePrevWeek}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <ChevronLeft className="h-5 w-5 text-gray-600" />
            </button>
            <span className="text-gray-600 font-medium">
              {format(currentWeek, 'MMM d')} - {format(addDays(currentWeek, 6), 'MMM d, yyyy')}
            </span>
            <button
              onClick={handleNextWeek}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <ChevronRight className="h-5 w-5 text-gray-600" />
            </button>
          </div>
          <button
            onClick={() => setShowScheduleForm(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Schedule Meeting
          </button>
        </div>

        <div className="grid grid-cols-8 gap-4">
          <div className="col-span-1"></div>
          {weekDays.map((day) => (
            <div
              key={day.toString()}
              className={`col-span-1 text-center p-2 rounded-lg ${
                isSameDay(day, new Date()) ? 'bg-indigo-50' : ''
              }`}
            >
              <div className="font-medium text-gray-800">
                {format(day, 'EEE')}
              </div>
              <div className="text-gray-600">{format(day, 'd')}</div>
            </div>
          ))}

          {timeSlots.map((time) => (
            <React.Fragment key={time}>
              <div className="col-span-1 text-right pr-4 py-4 text-gray-600">
                {time}
              </div>
              {weekDays.map((day) => {
                const dayMeetings = getMeetingsForDateAndTime(day, time);
                return (
                  <div
                    key={`${day}-${time}`}
                    className={`col-span-1 border border-gray-200 p-2 min-h-[80px] hover:bg-gray-50 cursor-pointer ${
                      isSameDay(day, new Date()) ? 'bg-indigo-50' : ''
                    }`}
                    onClick={() => {
                      setSelectedDate(day);
                      setNewMeeting((prev) => ({ ...prev, time }));
                      setShowScheduleForm(true);
                    }}
                  >
                    {dayMeetings.map((meeting) => (
                      <div
                        key={meeting.id}
                        className={`text-sm p-2 rounded-lg mb-1 ${
                          meeting.type === 'qualification'
                            ? 'bg-blue-100 text-blue-800'
                            : meeting.type === 'demo'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-purple-100 text-purple-800'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{meeting.title}</span>
                          {getLocationIcon(meeting.location)}
                        </div>
                        <div className="text-xs mt-1">{meeting.company}</div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>

      {showScheduleForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Schedule Meeting</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={newMeeting.title}
                  onChange={(e) => setNewMeeting({ ...newMeeting, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Meeting title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company
                </label>
                <input
                  type="text"
                  value={newMeeting.company}
                  onChange={(e) => setNewMeeting({ ...newMeeting, company: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Company name"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type
                  </label>
                  <select
                    value={newMeeting.type}
                    onChange={(e) => setNewMeeting({ ...newMeeting, type: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="qualification">Qualification Call</option>
                    <option value="demo">Product Demo</option>
                    <option value="follow-up">Follow-up</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <select
                    value={newMeeting.location}
                    onChange={(e) => setNewMeeting({ ...newMeeting, location: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="video">Video Call</option>
                    <option value="phone">Phone Call</option>
                    <option value="in-person">In Person</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Time
                </label>
                <select
                  value={newMeeting.time}
                  onChange={(e) => setNewMeeting({ ...newMeeting, time: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  {timeSlots.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Attendees (comma-separated emails)
                </label>
                <input
                  type="text"
                  value={newMeeting.attendees}
                  onChange={(e) => setNewMeeting({ ...newMeeting, attendees: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="email@example.com, email2@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  value={newMeeting.notes}
                  onChange={(e) => setNewMeeting({ ...newMeeting, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  rows={3}
                  placeholder="Additional meeting notes..."
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowScheduleForm(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleScheduleMeeting}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Schedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;