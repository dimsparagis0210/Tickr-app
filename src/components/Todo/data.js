export const colors = {
    high: "rgba(238, 42, 42, 0.8)",
    medium: "rgba(255, 196, 58, 0.8)",
    low: "rgba(173, 255, 122, 0.8)",
}

export const inputs = {
    name: {
        type: "text",
        placeholder: "Name",
        label: "Name",
        error: 0,
        id: 1,
        name: "name",
    },
    description: {
        type: "text",
        placeholder: "Description",
        label: "Description",
        error: 0,
        id: 2,
        name: "description",
    },
    deadline: {
        type: "time",
        placeholder: "Deadline",
        label: "Deadline",
        error: 0,
        id: 3,
        name: "deadline",
    },
    priority: {
        type: "radio",
        placeholder: "Priority",
        label: "Priority",
        error: 0,
        id: 5,
        name: "priority",
        value: colors,
    },
}

export const dummy_tasks = [
    {
        name: "Do the laundry",
        id: 1,
        task: "Do the laundry",
        completed: false,
        date: "2021-09-30",
        time: "10:00",
        priority: "high",
        deadline: 10,
        notes: "Don't forget to separate the colors",
        color: colors.high
    },
    {
        name: "Buy groceries",
        id: 2,
        task: "Buy groceries",
        completed: false,
        date: "2021-09-30",
        time: "12:00",
        priority: "medium",
        deadline: 12,
        notes: "Don't forget the milk",
        color: colors.medium
    },
    {
        name: "Walk the dog",
        id: 3,
        task: "Walk the dog",
        completed: false,
        date: "2021-09-30",
        time: "15:00",
        priority: "low",
        deadline: 15,
        notes: "Don't forget the leash",
        color: colors.low
    },
];