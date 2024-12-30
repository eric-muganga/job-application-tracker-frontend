import React from 'react';
import {useSelector} from "react-redux";
import { Reminder,selectReminders} from "../../../store/dashboardSlice.ts";
import {RootState} from "../../../store/store.ts";

const RemindersCard: React.FC = () => {
    const remainders = useSelector<RootState, Reminder[]>(selectReminders);
    return (
        <div className="p-4 bg-white shadow rounded">
            <h2 className="text-lg font-semibold mb-2">Reminders</h2>
            {remainders.length === 0 ? (
                <p>No Reminders found.</p>
            ):(
                <ul className="">
                    {remainders.map((reminder) => (
                        <li key={reminder.id} className="mb-2">
                            <div>{reminder.text}</div>
                            {reminder.date && (
                                <div className="text-sm text-gray-500">Due: {reminder.date}</div>
                            )}
                        </li>
                    ))}

                </ul>
            )}
        </div>

    )
};

export default RemindersCard;
