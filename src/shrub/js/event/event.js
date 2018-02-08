import $Node					from '../node/node';

const _EventTypeCache = {};

export const GetPhaseSequenceList = (eventType) => {
	if (Object.keys(_EventTypeCache).indexOf(eventType) > -1) {
		return Promise.resolve(_EventTypeCache[eventType]);
	}

	/* For when endpoint exists
	Fetch('/event/types/' + eventType)
		.then(r => {
			_EventTypeCache[eventType] = r.sequence
			return r.sequence;
		});
	*/
	return Promise.resolve([]);
};

export const GetPhaseSequence = (eventID) => {
	return $Node.Get(eventID)
		.then((r) => {
		if (r.node[0].meta) {
			return GetPhaseSequenceList(r.node[0].meta['event-type']);
		}
		return Promise.resolve([]);
	});
};

export const GetActivePhase = (eventID) => {
	return $Node.Get(eventID)
		.then((r) => {
			if (r.node[0].meta) {
				return r.node[0].meta['event-phase'];
			}
		});
};

export const HasPhase = (eventID, phase) => {
	return GetPhaseSequence(eventID)
		.then((sequence) => {
			return Promise.resolve(sequence.indexOf(phase) > -1);
		});
};

export const GetPhaseStatus = (eventID, phase) => {
	const phases = {};
	const seqPromise = GetPhaseSequence(eventID)
		.then((sequence) => {
			phase.sequence = sequence;
		});
	const activePhasePromise = GetActivePhase(eventID)
		.then((phase) => {
			phase.active = phase;
		});

	return Promise.all([seqPromise, activePhasePromise])
		.then(() => {
			if (phase && phases.active === phase) {
				return 'active';
			}
			else if (phases.indexOf(phase) === -1) {
				return 'not-included';
			}
			else if (!phases.active || phases.sequence.indexOf(phases.active) < phases.sequence.indexOf(phase)) {
				return 'comming';
			}
			else {
				return 'passed';
			}
		});
};

export const GetPhaseSchedule = (eventID) => {
	const data = {};
	const nodePromise = $Node.Get(eventID)
		.then(r => {
			data.node = r.node[0];
		});
	const seqPromise = GetPhaseSequence(eventID)
		.then(seq => {
			data.sequence = seq;
		});

	Promise.all([nodePromise, seqPromise])
		.then(() => {
			return data.sequence.map(phase => ({
				'phase': phase,
				'start': node.meta['event-schedule-' + phase],
			}));
		});
};

export default {
	GetPhaseSchedule,
	GetPhaseStatus,
	HasPhase,
	GetActivePhase,
	GetPhaseSequence,
	GetPhaseSequenceList,
};
