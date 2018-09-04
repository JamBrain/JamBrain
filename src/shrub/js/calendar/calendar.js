const DefaultEvent = 97793;
const EventDetails = {
  '97793': {
		'event-start': new Date(Date.UTC(2018, 7, 10, 22, 0, 0)),
		'event-compo-end': new Date(Date.UTC(2018, 7, 12, 22, 0, 0)),
		'event-compo-end-submission': new Date(Date.UTC(2018, 7, 12, 23, 0, 0)),
    'event-jam-end': new Date(Date.UTC(2018, 7, 13, 22, 0, 0)),
    'event-jam-end-submission': new Date(Date.UTC(2018, 7, 14, 22, 0, 0)),
		'event-grade-end': new Date(Date.UTC(2018, 8, 4, 20, 0, 0)),
		'event-results-publish': new Date(Date.UTC(2018, 8, 4, 24, 0, 0)),
  },
};

const Calendar = {
  '0': {
    'when': new Date(Date.UTC(2018, 2, 24)),
    'what': 'Theme Suggestions Open',
    'icon': 'suggestion',
    'precision': 'day',
  },
  '1': {
    'when': new Date(Date.UTC(2018, 3, 7)),
    'what': 'Theme Selection Starts',
    'icon': 'mallet',
    'precision': 'day',
  },
  '2': {
    'when': new Date(Date.UTC(2018, 3, 21)),
    'what': 'Ludum Dare 38',
    'icon': 'trophy',
    'precision': 'day',
  },
  '3': {
    'when': new Date(Date.UTC(2018, 4, 19)),
    'what': 'Results',
    'icon': 'checker',
    'precision': 'day',
  },
  '4': {
    'when': new Date(Date.UTC(2018, 5, 28)),
    'what': 'Ludum Dare 39',
    'icon': 'trophy',
    'precision': 'day',
  },
  '5': {
    'when': new Date(Date.UTC(2018, 7, 23)),
    'what': 'Results',
    'icon': 'checker',
    'precision': 'day',
  },
  '6': {
    'when': new Date(Date.UTC(2018, 3, 20)),
    'what': 'Ludum Dare 41',
    'icon': 'trophy',
    'precision': 'day',
  },
  '7': {
    'when': new Date(Date.UTC(2018, 11, 28)),
    'what': 'Results',
    'icon': 'checker',
    'precision': 'day',
  },
  '8': {
    'when': new Date(Date.UTC(2018, 7, 10)),
    'what': 'Ludum Dare 42',
    'icon': 'trophy',
    'precision': 'day',
  },
  '9': {
    'when': new Date(Date.UTC(2018, 11, 1)),
    'what': 'Ludum Dare 43',
    'icon': 'trophy',
    'precision': 'month',
  },
  '10': {
    'when': new Date(Date.UTC(2019, 3, 1)),
    'what': 'Ludum Dare 43',
    'icon': 'trophy',
    'precision': 'month',
  },
};

const GetEvent = (node) => {
  let calendar;
  if ( History[node] ) {
    calendar = Object.assign({}, History[node]);
  }
  else if ( !!node ) {
    calendar = Object.assign({}, History[DefaultEvent]);
  }
  return Promise.resolve({
    'status': 200,
    'calendar': calendar,
  });
};

const Get = (fromDate=null, toDate=null, maxCount=null) => {
    return Promise.resolve({
      'status': 200,
      'calendar':
          Object.assign(...Object.entries(Calendar)
            .filter(([id, val]) => {
              if (!fromDate && !toDate) return true;
              if (!(fromDate && fromDate <= val.when)) {
                return false;
              }
              if (!(toDate && toDate >= val.when)) {
                return false;
              }
              return true;
            })
            .sort(([id, val], [id2, val2]) => val2.when - val.when)
            .slice(0, maxCount == null ? Object.keys(Calendar).length : maxCount)
            .map(([k, v]) => ({[k]: v}))),
    });
};

export default {
	GetEvent,
  Get,
};
