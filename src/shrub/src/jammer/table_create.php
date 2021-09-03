<?php

// Not tables, but nodes

MakeKeyNode('SH_NODE_ID_ITEMS', SH_NODE_ID_ROOT, SH_NODE_TYPE_ITEMS, '', '', 'items', 'Items' );
MakeKeyNode('SH_NODE_ID_TAGS', SH_NODE_ID_ROOT, 'group', SH_NODE_TYPE_TAGS, '', 'tags', 'Tags' );
$events_id = MakeKeyNode('SH_NODE_ID_EVENTS', SH_NODE_ID_ROOT, 'group', SH_NODE_TYPE_EVENTS, '', 'events', 'Events' );

MakeKeyNode('jammer-root', SH_NODE_ID_ROOT, SH_NODE_TYPE_SITE, '', '', 'jammer', 'Jammer' );
MakeKeyNode('ludumdare-root', SH_NODE_ID_ROOT, SH_NODE_TYPE_SITE, '', '', 'ludum-dare', 'Ludum Dare' );
MakeKeyNode('jammer.bio-root', SH_NODE_ID_ROOT, SH_NODE_TYPE_SITE, '', '', 'jammer-bio', 'Jammer.bio' );

MakeKeyNode('ludum-dare-event', $events_id /*SH_NODE_ID_EVENTS*/, 'group', SH_NODE_TYPE_EVENTS, '', 'ludum-dare', 'Ludum Dare' );
