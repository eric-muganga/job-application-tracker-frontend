import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/store.ts";
import { Activity, selectActivities } from "../../../store/dashboardSlice";

const ActivityFeed: React.FC = () => {
    const activities = useSelector<RootState, Activity[]>(selectActivities);

    return (
        <div className="p-4 bg-white shadow rounded space-y-4">
            <h2 className="text-lg font-semibold">Recent Activity</h2>
            {activities.length === 0 ? (
                <p className="text-sm">No recent activity.</p>
            ) : (
                <ul>
                    {activities.map((act) => (
                        <li key={act.id} className="border-b py-2">
                            <div className="text-md">{act.text}</div>
                            <div className="text-sm text-gray-500">
                                {act.date
                                    ? new Date(act.date).toLocaleString()
                                    : "No date provided"}
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ActivityFeed;
