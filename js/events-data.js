import { events } from './data/events.js';
import { categories } from './data/categories.js';
import { initialState } from './state/appState.js';

window.CONCLAVE_EVENTS = initialState.events.map(e => {
    const catObj = categories.find(c => c.id === e.category);
    return {
        id: e.id,
        title: e.title,
        location: e.location,
        time: e.time,
        date: e.date,
        category: catObj ? catObj.name : e.category,
        description: e.description,
        image: e.image,
        capacity: e.maxAttendees,
        price: e.price
    };
});
