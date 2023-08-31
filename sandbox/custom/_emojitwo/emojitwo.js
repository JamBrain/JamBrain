/* jshint maxerr: 10000 */
/* jslint unused: true */
/* jshint shadow: true */
/* jshint -W075 */

// MK: Customized version of emojione.
// - Sprite support (spans with offsets) is removed.
// - Titles are set (to show the emoji code on hover).
// - ASCII is enabled by default, and now an argument of shortnameToImage.
// - ns.unicodeAlt removed. Assumed true.
// - ASCII regex change to (()("+ns.asciiRegexp+")()) to fix newline prefix/suffix bug.
// - ns.shortnameToAscii removed.
// - ns.unifyUnicode removed.
// - ns.shortnameToUnicode removed.
// - ns.toImage removed.
// - ns.unicodeToImage removed.
// - ns.mapShortToUnicode removed.
// - ns.objectFlip removed.
// - ns.escapeRegExp removed.
// - ns.jsecapeMap removed.
// - ns.unicodeRegexp removed.
// - removed B) 8) smileys. Use B-) 8-) instead.
// - Placed some //" lines to un-confuse text editors of some of the regex wackyness.

// NOTE: -_- -__- -___- get eaten by the Markdown parser.

// Actual Usage:
// - Use 'emojione.toShort' to convert Unicode characters to short codes. Used by preview only.
// - Use 'emojione.shortnameToImage' to convert short names and ASCII smileys to images.

(function(ns){
    ns.emojioneList = {':hash:':["0023-fe0f-20e3","0023-20e3"],':zero:':["0030-fe0f-20e3","0030-20e3"],':one:':["0031-fe0f-20e3","0031-20e3"],':two:':["0032-fe0f-20e3","0032-20e3"],':three:':["0033-fe0f-20e3","0033-20e3"],':four:':["0034-fe0f-20e3","0034-20e3"],':five:':["0035-fe0f-20e3","0035-20e3"],':six:':["0036-fe0f-20e3","0036-20e3"],':seven:':["0037-fe0f-20e3","0037-20e3"],':eight:':["0038-fe0f-20e3","0038-20e3"],':nine:':["0039-fe0f-20e3","0039-20e3"],':copyright:':["00a9"],':registered:':["00ae"],':bangbang:':["203c-fe0f","203c"],':interrobang:':["2049-fe0f","2049"],':tm:':["2122"],':information_source:':["2139-fe0f","2139"],':left_right_arrow:':["2194-fe0f","2194"],':arrow_up_down:':["2195-fe0f","2195"],':arrow_upper_left:':["2196-fe0f","2196"],':arrow_upper_right:':["2197-fe0f","2197"],':arrow_lower_right:':["2198-fe0f","2198"],':arrow_lower_left:':["2199-fe0f","2199"],':leftwards_arrow_with_hook:':["21a9-fe0f","21a9"],':arrow_right_hook:':["21aa-fe0f","21aa"],':watch:':["231a-fe0f","231a"],':hourglass:':["231b-fe0f","231b"],':fast_forward:':["23e9"],':rewind:':["23ea"],':arrow_double_up:':["23eb"],':arrow_double_down:':["23ec"],':alarm_clock:':["23f0"],':hourglass_flowing_sand:':["23f3"],':m:':["24c2-fe0f","24c2"],':black_small_square:':["25aa-fe0f","25aa"],':white_small_square:':["25ab-fe0f","25ab"],':arrow_forward:':["25b6-fe0f","25b6"],':arrow_backward:':["25c0-fe0f","25c0"],':white_medium_square:':["25fb-fe0f","25fb"],':black_medium_square:':["25fc-fe0f","25fc"],':white_medium_small_square:':["25fd-fe0f","25fd"],':black_medium_small_square:':["25fe-fe0f","25fe"],':sunny:':["2600-fe0f","2600"],':cloud:':["2601-fe0f","2601"],':telephone:':["260e-fe0f","260e"],':ballot_box_with_check:':["2611-fe0f","2611"],':umbrella:':["2614-fe0f","2614"],':coffee:':["2615-fe0f","2615"],':point_up:':["261d-fe0f","261d"],':relaxed:':["263a-fe0f","263a"],':aries:':["2648-fe0f","2648"],':taurus:':["2649-fe0f","2649"],':gemini:':["264a-fe0f","264a"],':cancer:':["264b-fe0f","264b"],':leo:':["264c-fe0f","264c"],':virgo:':["264d-fe0f","264d"],':libra:':["264e-fe0f","264e"],':scorpius:':["264f-fe0f","264f"],':sagittarius:':["2650-fe0f","2650"],':capricorn:':["2651-fe0f","2651"],':aquarius:':["2652-fe0f","2652"],':pisces:':["2653-fe0f","2653"],':spades:':["2660-fe0f","2660"],':clubs:':["2663-fe0f","2663"],':hearts:':["2665-fe0f","2665"],':diamonds:':["2666-fe0f","2666"],':hotsprings:':["2668-fe0f","2668"],':recycle:':["267b-fe0f","267b"],':wheelchair:':["267f-fe0f","267f"],':anchor:':["2693-fe0f","2693"],':warning:':["26a0-fe0f","26a0"],':zap:':["26a1-fe0f","26a1"],':white_circle:':["26aa-fe0f","26aa"],':black_circle:':["26ab-fe0f","26ab"],':soccer:':["26bd-fe0f","26bd"],':baseball:':["26be-fe0f","26be"],':snowman:':["26c4-fe0f","26c4"],':partly_sunny:':["26c5-fe0f","26c5"],':ophiuchus:':["26ce"],':no_entry:':["26d4-fe0f","26d4"],':church:':["26ea-fe0f","26ea"],':fountain:':["26f2-fe0f","26f2"],':golf:':["26f3-fe0f","26f3"],':sailboat:':["26f5-fe0f","26f5"],':tent:':["26fa-fe0f","26fa"],':fuelpump:':["26fd-fe0f","26fd"],':scissors:':["2702-fe0f","2702"],':white_check_mark:':["2705"],':airplane:':["2708-fe0f","2708"],':envelope:':["2709-fe0f","2709"],':fist:':["270a"],':raised_hand:':["270b"],':v:':["270c-fe0f","270c"],':pencil2:':["270f-fe0f","270f"],':black_nib:':["2712-fe0f","2712"],':heavy_check_mark:':["2714-fe0f","2714"],':heavy_multiplication_x:':["2716-fe0f","2716"],':sparkles:':["2728"],':eight_spoked_asterisk:':["2733-fe0f","2733"],':eight_pointed_black_star:':["2734-fe0f","2734"],':snowflake:':["2744-fe0f","2744"],':sparkle:':["2747-fe0f","2747"],':x:':["274c"],':negative_squared_cross_mark:':["274e"],':question:':["2753"],':grey_question:':["2754"],':grey_exclamation:':["2755"],':exclamation:':["2757-fe0f","2757"],':heart:':["2764-fe0f","2764"],':heavy_plus_sign:':["2795"],':heavy_minus_sign:':["2796"],':heavy_division_sign:':["2797"],':arrow_right:':["27a1-fe0f","27a1"],':curly_loop:':["27b0"],':arrow_heading_up:':["2934-fe0f","2934"],':arrow_heading_down:':["2935-fe0f","2935"],':arrow_left:':["2b05-fe0f","2b05"],':arrow_up:':["2b06-fe0f","2b06"],':arrow_down:':["2b07-fe0f","2b07"],':black_large_square:':["2b1b-fe0f","2b1b"],':white_large_square:':["2b1c-fe0f","2b1c"],':star:':["2b50-fe0f","2b50"],':o:':["2b55-fe0f","2b55"],':wavy_dash:':["3030"],':part_alternation_mark:':["303d-fe0f","303d"],':congratulations:':["3297-fe0f","3297"],':secret:':["3299-fe0f","3299"],':mahjong:':["1f004-fe0f","1f004"],':black_joker:':["1f0cf"],':a:':["1f170"],':b:':["1f171"],':o2:':["1f17e"],':parking:':["1f17f-fe0f","1f17f"],':ab:':["1f18e"],':cl:':["1f191"],':cool:':["1f192"],':free:':["1f193"],':id:':["1f194"],':new:':["1f195"],':ng:':["1f196"],':ok:':["1f197"],':sos:':["1f198"],':up:':["1f199"],':vs:':["1f19a"],':cn:':["1f1e8-1f1f3"],':de:':["1f1e9-1f1ea"],':es:':["1f1ea-1f1f8"],':fr:':["1f1eb-1f1f7"],':gb:':["1f1ec-1f1e7"],':it:':["1f1ee-1f1f9"],':jp:':["1f1ef-1f1f5"],':kr:':["1f1f0-1f1f7"],':us:':["1f1fa-1f1f8"],':ru:':["1f1f7-1f1fa"],':koko:':["1f201"],':sa:':["1f202"],':u7121:':["1f21a-fe0f","1f21a"],':u6307:':["1f22f-fe0f","1f22f"],':u7981:':["1f232"],':u7a7a:':["1f233"],':u5408:':["1f234"],':u6e80:':["1f235"],':u6709:':["1f236"],':u6708:':["1f237"],':u7533:':["1f238"],':u5272:':["1f239"],':u55b6:':["1f23a"],':ideograph_advantage:':["1f250"],':accept:':["1f251"],':cyclone:':["1f300"],':foggy:':["1f301"],':closed_umbrella:':["1f302"],':night_with_stars:':["1f303"],':sunrise_over_mountains:':["1f304"],':sunrise:':["1f305"],':city_dusk:':["1f306"],':city_sunset:':["1f307"],':city_sunrise:':["1f307"],':rainbow:':["1f308"],':bridge_at_night:':["1f309"],':ocean:':["1f30a"],':volcano:':["1f30b"],':milky_way:':["1f30c"],':earth_asia:':["1f30f"],':new_moon:':["1f311"],':first_quarter_moon:':["1f313"],':waxing_gibbous_moon:':["1f314"],':full_moon:':["1f315"],':crescent_moon:':["1f319"],':first_quarter_moon_with_face:':["1f31b"],':star2:':["1f31f"],':stars:':["1f320"],':chestnut:':["1f330"],':seedling:':["1f331"],':palm_tree:':["1f334"],':cactus:':["1f335"],':tulip:':["1f337"],':cherry_blossom:':["1f338"],':rose:':["1f339"],':hibiscus:':["1f33a"],':sunflower:':["1f33b"],':blossom:':["1f33c"],':corn:':["1f33d"],':ear_of_rice:':["1f33e"],':herb:':["1f33f"],':four_leaf_clover:':["1f340"],':maple_leaf:':["1f341"],':fallen_leaf:':["1f342"],':leaves:':["1f343"],':mushroom:':["1f344"],':tomato:':["1f345"],':eggplant:':["1f346"],':grapes:':["1f347"],':melon:':["1f348"],':watermelon:':["1f349"],':tangerine:':["1f34a"],':banana:':["1f34c"],':pineapple:':["1f34d"],':apple:':["1f34e"],':green_apple:':["1f34f"],':peach:':["1f351"],':cherries:':["1f352"],':strawberry:':["1f353"],':hamburger:':["1f354"],':pizza:':["1f355"],':meat_on_bone:':["1f356"],':poultry_leg:':["1f357"],':rice_cracker:':["1f358"],':rice_ball:':["1f359"],':rice:':["1f35a"],':curry:':["1f35b"],':ramen:':["1f35c"],':spaghetti:':["1f35d"],':bread:':["1f35e"],':fries:':["1f35f"],':sweet_potato:':["1f360"],':dango:':["1f361"],':oden:':["1f362"],':sushi:':["1f363"],':fried_shrimp:':["1f364"],':fish_cake:':["1f365"],':icecream:':["1f366"],':shaved_ice:':["1f367"],':ice_cream:':["1f368"],':doughnut:':["1f369"],':cookie:':["1f36a"],':chocolate_bar:':["1f36b"],':candy:':["1f36c"],':lollipop:':["1f36d"],':custard:':["1f36e"],':honey_pot:':["1f36f"],':cake:':["1f370"],':bento:':["1f371"],':stew:':["1f372"],':egg:':["1f373"],':fork_and_knife:':["1f374"],':tea:':["1f375"],':sake:':["1f376"],':wine_glass:':["1f377"],':cocktail:':["1f378"],':tropical_drink:':["1f379"],':beer:':["1f37a"],':beers:':["1f37b"],':ribbon:':["1f380"],':gift:':["1f381"],':birthday:':["1f382"],':jack_o_lantern:':["1f383"],':christmas_tree:':["1f384"],':santa:':["1f385"],':fireworks:':["1f386"],':sparkler:':["1f387"],':balloon:':["1f388"],':tada:':["1f389"],':confetti_ball:':["1f38a"],':tanabata_tree:':["1f38b"],':crossed_flags:':["1f38c"],':bamboo:':["1f38d"],':dolls:':["1f38e"],':flags:':["1f38f"],':wind_chime:':["1f390"],':rice_scene:':["1f391"],':school_satchel:':["1f392"],':mortar_board:':["1f393"],':carousel_horse:':["1f3a0"],':ferris_wheel:':["1f3a1"],':roller_coaster:':["1f3a2"],':fishing_pole_and_fish:':["1f3a3"],':microphone:':["1f3a4"],':movie_camera:':["1f3a5"],':cinema:':["1f3a6"],':headphones:':["1f3a7"],':art:':["1f3a8"],':tophat:':["1f3a9"],':circus_tent:':["1f3aa"],':ticket:':["1f3ab"],':clapper:':["1f3ac"],':performing_arts:':["1f3ad"],':video_game:':["1f3ae"],':dart:':["1f3af"],':slot_machine:':["1f3b0"],':8ball:':["1f3b1"],':game_die:':["1f3b2"],':bowling:':["1f3b3"],':flower_playing_cards:':["1f3b4"],':musical_note:':["1f3b5"],':notes:':["1f3b6"],':saxophone:':["1f3b7"],':guitar:':["1f3b8"],':musical_keyboard:':["1f3b9"],':trumpet:':["1f3ba"],':violin:':["1f3bb"],':musical_score:':["1f3bc"],':running_shirt_with_sash:':["1f3bd"],':tennis:':["1f3be"],':ski:':["1f3bf"],':basketball:':["1f3c0"],':checkered_flag:':["1f3c1"],':snowboarder:':["1f3c2"],':runner:':["1f3c3"],':surfer:':["1f3c4"],':trophy:':["1f3c6"],':football:':["1f3c8"],':swimmer:':["1f3ca"],':house:':["1f3e0"],':house_with_garden:':["1f3e1"],':office:':["1f3e2"],':post_office:':["1f3e3"],':hospital:':["1f3e5"],':bank:':["1f3e6"],':atm:':["1f3e7"],':hotel:':["1f3e8"],':love_hotel:':["1f3e9"],':convenience_store:':["1f3ea"],':school:':["1f3eb"],':department_store:':["1f3ec"],':factory:':["1f3ed"],':izakaya_lantern:':["1f3ee"],':japanese_castle:':["1f3ef"],':european_castle:':["1f3f0"],':snail:':["1f40c"],':snake:':["1f40d"],':racehorse:':["1f40e"],':sheep:':["1f411"],':monkey:':["1f412"],':chicken:':["1f414"],':boar:':["1f417"],':elephant:':["1f418"],':octopus:':["1f419"],':shell:':["1f41a"],':bug:':["1f41b"],':ant:':["1f41c"],':bee:':["1f41d"],':beetle:':["1f41e"],':fish:':["1f41f"],':tropical_fish:':["1f420"],':blowfish:':["1f421"],':turtle:':["1f422"],':hatching_chick:':["1f423"],':baby_chick:':["1f424"],':hatched_chick:':["1f425"],':bird:':["1f426"],':penguin:':["1f427"],':koala:':["1f428"],':poodle:':["1f429"],':camel:':["1f42b"],':dolphin:':["1f42c"],':mouse:':["1f42d"],':cow:':["1f42e"],':tiger:':["1f42f"],':rabbit:':["1f430"],':cat:':["1f431"],':dragon_face:':["1f432"],':whale:':["1f433"],':horse:':["1f434"],':monkey_face:':["1f435"],':dog:':["1f436"],':pig:':["1f437"],':frog:':["1f438"],':hamster:':["1f439"],':wolf:':["1f43a"],':bear:':["1f43b"],':panda_face:':["1f43c"],':pig_nose:':["1f43d"],':feet:':["1f43e"],':eyes:':["1f440"],':ear:':["1f442"],':nose:':["1f443"],':lips:':["1f444"],':tongue:':["1f445"],':point_up_2:':["1f446"],':point_down:':["1f447"],':point_left:':["1f448"],':point_right:':["1f449"],':punch:':["1f44a"],':wave:':["1f44b"],':ok_hand:':["1f44c"],':thumbsup:':["1f44d"],':+1:':["1f44d"],':thumbsdown:':["1f44e"],':-1:':["1f44e"],':clap:':["1f44f"],':open_hands:':["1f450"],':crown:':["1f451"],':womans_hat:':["1f452"],':eyeglasses:':["1f453"],':necktie:':["1f454"],':shirt:':["1f455"],':jeans:':["1f456"],':dress:':["1f457"],':kimono:':["1f458"],':bikini:':["1f459"],':womans_clothes:':["1f45a"],':purse:':["1f45b"],':handbag:':["1f45c"],':pouch:':["1f45d"],':mans_shoe:':["1f45e"],':athletic_shoe:':["1f45f"],':high_heel:':["1f460"],':sandal:':["1f461"],':boot:':["1f462"],':footprints:':["1f463"],':bust_in_silhouette:':["1f464"],':boy:':["1f466"],':girl:':["1f467"],':man:':["1f468"],':woman:':["1f469"],':family:':["1f46a"],':couple:':["1f46b"],':cop:':["1f46e"],':dancers:':["1f46f"],':bride_with_veil:':["1f470"],':person_with_blond_hair:':["1f471"],':man_with_gua_pi_mao:':["1f472"],':man_with_turban:':["1f473"],':older_man:':["1f474"],':older_woman:':["1f475"],':grandma:':["1f475"],':baby:':["1f476"],':construction_worker:':["1f477"],':princess:':["1f478"],':japanese_ogre:':["1f479"],':japanese_goblin:':["1f47a"],':ghost:':["1f47b"],':angel:':["1f47c"],':alien:':["1f47d"],':space_invader:':["1f47e"],':imp:':["1f47f"],':skull:':["1f480"],':skeleton:':["1f480"],':card_index:':["1f4c7"],':information_desk_person:':["1f481"],':guardsman:':["1f482"],':dancer:':["1f483"],':lipstick:':["1f484"],':nail_care:':["1f485"],':ledger:':["1f4d2"],':massage:':["1f486"],':notebook:':["1f4d3"],':haircut:':["1f487"],':notebook_with_decorative_cover:':["1f4d4"],':barber:':["1f488"],':closed_book:':["1f4d5"],':syringe:':["1f489"],':book:':["1f4d6"],':pill:':["1f48a"],':green_book:':["1f4d7"],':kiss:':["1f48b"],':blue_book:':["1f4d8"],':love_letter:':["1f48c"],':orange_book:':["1f4d9"],':ring:':["1f48d"],':books:':["1f4da"],':gem:':["1f48e"],':name_badge:':["1f4db"],':couplekiss:':["1f48f"],':scroll:':["1f4dc"],':bouquet:':["1f490"],':pencil:':["1f4dd"],':couple_with_heart:':["1f491"],':telephone_receiver:':["1f4de"],':wedding:':["1f492"],':pager:':["1f4df"],':fax:':["1f4e0"],':heartbeat:':["1f493"],':satellite:':["1f4e1"],':loudspeaker:':["1f4e2"],':broken_heart:':["1f494"],':mega:':["1f4e3"],':outbox_tray:':["1f4e4"],':two_hearts:':["1f495"],':inbox_tray:':["1f4e5"],':package:':["1f4e6"],':sparkling_heart:':["1f496"],':e-mail:':["1f4e7"],':email:':["1f4e7"],':incoming_envelope:':["1f4e8"],':heartpulse:':["1f497"],':envelope_with_arrow:':["1f4e9"],':mailbox_closed:':["1f4ea"],':cupid:':["1f498"],':mailbox:':["1f4eb"],':postbox:':["1f4ee"],':blue_heart:':["1f499"],':newspaper:':["1f4f0"],':iphone:':["1f4f1"],':green_heart:':["1f49a"],':calling:':["1f4f2"],':vibration_mode:':["1f4f3"],':yellow_heart:':["1f49b"],':mobile_phone_off:':["1f4f4"],':signal_strength:':["1f4f6"],':purple_heart:':["1f49c"],':camera:':["1f4f7"],':video_camera:':["1f4f9"],':gift_heart:':["1f49d"],':tv:':["1f4fa"],':radio:':["1f4fb"],':revolving_hearts:':["1f49e"],':vhs:':["1f4fc"],':arrows_clockwise:':["1f503"],':heart_decoration:':["1f49f"],':loud_sound:':["1f50a"],':battery:':["1f50b"],':diamond_shape_with_a_dot_inside:':["1f4a0"],':electric_plug:':["1f50c"],':mag:':["1f50d"],':bulb:':["1f4a1"],':mag_right:':["1f50e"],':lock_with_ink_pen:':["1f50f"],':anger:':["1f4a2"],':closed_lock_with_key:':["1f510"],':key:':["1f511"],':bomb:':["1f4a3"],':lock:':["1f512"],':unlock:':["1f513"],':zzz:':["1f4a4"],':bell:':["1f514"],':bookmark:':["1f516"],':boom:':["1f4a5"],':link:':["1f517"],':radio_button:':["1f518"],':sweat_drops:':["1f4a6"],':back:':["1f519"],':end:':["1f51a"],':droplet:':["1f4a7"],':on:':["1f51b"],':soon:':["1f51c"],':dash:':["1f4a8"],':top:':["1f51d"],':underage:':["1f51e"],':poop:':["1f4a9"],':shit:':["1f4a9"],':hankey:':["1f4a9"],':poo:':["1f4a9"],':keycap_ten:':["1f51f"],':muscle:':["1f4aa"],':capital_abcd:':["1f520"],':abcd:':["1f521"],':dizzy:':["1f4ab"],':1234:':["1f522"],':symbols:':["1f523"],':speech_balloon:':["1f4ac"],':abc:':["1f524"],':fire:':["1f525"],':flame:':["1f525"],':white_flower:':["1f4ae"],':flashlight:':["1f526"],':wrench:':["1f527"],':100:':["1f4af"],':hammer:':["1f528"],':nut_and_bolt:':["1f529"],':moneybag:':["1f4b0"],':knife:':["1f52a"],':gun:':["1f52b"],':currency_exchange:':["1f4b1"],':crystal_ball:':["1f52e"],':heavy_dollar_sign:':["1f4b2"],':six_pointed_star:':["1f52f"],':credit_card:':["1f4b3"],':beginner:':["1f530"],':trident:':["1f531"],':yen:':["1f4b4"],':black_square_button:':["1f532"],':white_square_button:':["1f533"],':dollar:':["1f4b5"],':red_circle:':["1f534"],':large_blue_circle:':["1f535"],':money_with_wings:':["1f4b8"],':large_orange_diamond:':["1f536"],':large_blue_diamond:':["1f537"],':chart:':["1f4b9"],':small_orange_diamond:':["1f538"],':small_blue_diamond:':["1f539"],':seat:':["1f4ba"],':small_red_triangle:':["1f53a"],':small_red_triangle_down:':["1f53b"],':computer:':["1f4bb"],':arrow_up_small:':["1f53c"],':briefcase:':["1f4bc"],':arrow_down_small:':["1f53d"],':clock1:':["1f550"],':minidisc:':["1f4bd"],':clock2:':["1f551"],':floppy_disk:':["1f4be"],':clock3:':["1f552"],':cd:':["1f4bf"],':clock4:':["1f553"],':dvd:':["1f4c0"],':clock5:':["1f554"],':clock6:':["1f555"],':file_folder:':["1f4c1"],':clock7:':["1f556"],':clock8:':["1f557"],':open_file_folder:':["1f4c2"],':clock9:':["1f558"],':clock10:':["1f559"],':page_with_curl:':["1f4c3"],':clock11:':["1f55a"],':clock12:':["1f55b"],':page_facing_up:':["1f4c4"],':mount_fuji:':["1f5fb"],':tokyo_tower:':["1f5fc"],':date:':["1f4c5"],':statue_of_liberty:':["1f5fd"],':japan:':["1f5fe"],':calendar:':["1f4c6"],':moyai:':["1f5ff"],':grin:':["1f601"],':joy:':["1f602"],':smiley:':["1f603"],':chart_with_upwards_trend:':["1f4c8"],':smile:':["1f604"],':sweat_smile:':["1f605"],':chart_with_downwards_trend:':["1f4c9"],':laughing:':["1f606"],':satisfied:':["1f606"],':wink:':["1f609"],':bar_chart:':["1f4ca"],':blush:':["1f60a"],':yum:':["1f60b"],':clipboard:':["1f4cb"],':relieved:':["1f60c"],':heart_eyes:':["1f60d"],':pushpin:':["1f4cc"],':smirk:':["1f60f"],':unamused:':["1f612"],':round_pushpin:':["1f4cd"],':sweat:':["1f613"],':pensive:':["1f614"],':paperclip:':["1f4ce"],':confounded:':["1f616"],':kissing_heart:':["1f618"],':straight_ruler:':["1f4cf"],':kissing_closed_eyes:':["1f61a"],':stuck_out_tongue_winking_eye:':["1f61c"],':triangular_ruler:':["1f4d0"],':stuck_out_tongue_closed_eyes:':["1f61d"],':disappointed:':["1f61e"],':bookmark_tabs:':["1f4d1"],':angry:':["1f620"],':rage:':["1f621"],':cry:':["1f622"],':persevere:':["1f623"],':triumph:':["1f624"],':disappointed_relieved:':["1f625"],':fearful:':["1f628"],':weary:':["1f629"],':sleepy:':["1f62a"],':tired_face:':["1f62b"],':sob:':["1f62d"],':cold_sweat:':["1f630"],':scream:':["1f631"],':astonished:':["1f632"],':flushed:':["1f633"],':dizzy_face:':["1f635"],':mask:':["1f637"],':smile_cat:':["1f638"],':joy_cat:':["1f639"],':smiley_cat:':["1f63a"],':heart_eyes_cat:':["1f63b"],':smirk_cat:':["1f63c"],':kissing_cat:':["1f63d"],':pouting_cat:':["1f63e"],':crying_cat_face:':["1f63f"],':scream_cat:':["1f640"],':no_good:':["1f645"],':ok_woman:':["1f646"],':bow:':["1f647"],':see_no_evil:':["1f648"],':hear_no_evil:':["1f649"],':speak_no_evil:':["1f64a"],':raising_hand:':["1f64b"],':raised_hands:':["1f64c"],':person_frowning:':["1f64d"],':person_with_pouting_face:':["1f64e"],':pray:':["1f64f"],':rocket:':["1f680"],':railway_car:':["1f683"],':bullettrain_side:':["1f684"],':bullettrain_front:':["1f685"],':metro:':["1f687"],':station:':["1f689"],':bus:':["1f68c"],':busstop:':["1f68f"],':ambulance:':["1f691"],':fire_engine:':["1f692"],':police_car:':["1f693"],':taxi:':["1f695"],':red_car:':["1f697"],':blue_car:':["1f699"],':truck:':["1f69a"],':ship:':["1f6a2"],':speedboat:':["1f6a4"],':traffic_light:':["1f6a5"],':construction:':["1f6a7"],':rotating_light:':["1f6a8"],':triangular_flag_on_post:':["1f6a9"],':door:':["1f6aa"],':no_entry_sign:':["1f6ab"],':smoking:':["1f6ac"],':no_smoking:':["1f6ad"],':bike:':["1f6b2"],':walking:':["1f6b6"],':mens:':["1f6b9"],':womens:':["1f6ba"],':restroom:':["1f6bb"],':baby_symbol:':["1f6bc"],':toilet:':["1f6bd"],':wc:':["1f6be"],':bath:':["1f6c0"],':grinning:':["1f600"],':innocent:':["1f607"],':smiling_imp:':["1f608"],':sunglasses:':["1f60e"],':neutral_face:':["1f610"],':expressionless:':["1f611"],':confused:':["1f615"],':kissing:':["1f617"],':kissing_smiling_eyes:':["1f619"],':stuck_out_tongue:':["1f61b"],':worried:':["1f61f"],':frowning:':["1f626"],':anguished:':["1f627"],':grimacing:':["1f62c"],':open_mouth:':["1f62e"],':hushed:':["1f62f"],':sleeping:':["1f634"],':no_mouth:':["1f636"],':helicopter:':["1f681"],':steam_locomotive:':["1f682"],':train2:':["1f686"],':light_rail:':["1f688"],':tram:':["1f68a"],':oncoming_bus:':["1f68d"],':trolleybus:':["1f68e"],':minibus:':["1f690"],':oncoming_police_car:':["1f694"],':oncoming_taxi:':["1f696"],':oncoming_automobile:':["1f698"],':articulated_lorry:':["1f69b"],':tractor:':["1f69c"],':monorail:':["1f69d"],':mountain_railway:':["1f69e"],':suspension_railway:':["1f69f"],':mountain_cableway:':["1f6a0"],':aerial_tramway:':["1f6a1"],':rowboat:':["1f6a3"],':vertical_traffic_light:':["1f6a6"],':put_litter_in_its_place:':["1f6ae"],':do_not_litter:':["1f6af"],':potable_water:':["1f6b0"],':non-potable_water:':["1f6b1"],':no_bicycles:':["1f6b3"],':bicyclist:':["1f6b4"],':mountain_bicyclist:':["1f6b5"],':no_pedestrians:':["1f6b7"],':children_crossing:':["1f6b8"],':shower:':["1f6bf"],':bathtub:':["1f6c1"],':passport_control:':["1f6c2"],':customs:':["1f6c3"],':baggage_claim:':["1f6c4"],':left_luggage:':["1f6c5"],':earth_africa:':["1f30d"],':earth_americas:':["1f30e"],':globe_with_meridians:':["1f310"],':waxing_crescent_moon:':["1f312"],':waning_gibbous_moon:':["1f316"],':last_quarter_moon:':["1f317"],':waning_crescent_moon:':["1f318"],':new_moon_with_face:':["1f31a"],':last_quarter_moon_with_face:':["1f31c"],':full_moon_with_face:':["1f31d"],':sun_with_face:':["1f31e"],':evergreen_tree:':["1f332"],':deciduous_tree:':["1f333"],':lemon:':["1f34b"],':pear:':["1f350"],':baby_bottle:':["1f37c"],':horse_racing:':["1f3c7"],':rugby_football:':["1f3c9"],':european_post_office:':["1f3e4"],':rat:':["1f400"],':mouse2:':["1f401"],':ox:':["1f402"],':water_buffalo:':["1f403"],':cow2:':["1f404"],':tiger2:':["1f405"],':leopard:':["1f406"],':rabbit2:':["1f407"],':cat2:':["1f408"],':dragon:':["1f409"],':crocodile:':["1f40a"],':whale2:':["1f40b"],':ram:':["1f40f"],':goat:':["1f410"],':rooster:':["1f413"],':dog2:':["1f415"],':pig2:':["1f416"],':dromedary_camel:':["1f42a"],':busts_in_silhouette:':["1f465"],':two_men_holding_hands:':["1f46c"],':two_women_holding_hands:':["1f46d"],':thought_balloon:':["1f4ad"],':euro:':["1f4b6"],':pound:':["1f4b7"],':mailbox_with_mail:':["1f4ec"],':mailbox_with_no_mail:':["1f4ed"],':postal_horn:':["1f4ef"],':no_mobile_phones:':["1f4f5"],':twisted_rightwards_arrows:':["1f500"],':repeat:':["1f501"],':repeat_one:':["1f502"],':arrows_counterclockwise:':["1f504"],':low_brightness:':["1f505"],':high_brightness:':["1f506"],':mute:':["1f507"],':sound:':["1f509"],':no_bell:':["1f515"],':microscope:':["1f52c"],':telescope:':["1f52d"],':clock130:':["1f55c"],':clock230:':["1f55d"],':clock330:':["1f55e"],':clock430:':["1f55f"],':clock530:':["1f560"],':clock630:':["1f561"],':clock730:':["1f562"],':clock830:':["1f563"],':clock930:':["1f564"],':clock1030:':["1f565"],':clock1130:':["1f566"],':clock1230:':["1f567"],':speaker:':["1f508"],':train:':["1f68b"],':loop:':["27bf"],':af:':["1f1e6-1f1eb"],':al:':["1f1e6-1f1f1"],':dz:':["1f1e9-1f1ff"],':ad:':["1f1e6-1f1e9"],':ao:':["1f1e6-1f1f4"],':ag:':["1f1e6-1f1ec"],':ar:':["1f1e6-1f1f7"],':am:':["1f1e6-1f1f2"],':au:':["1f1e6-1f1fa"],':at:':["1f1e6-1f1f9"],':az:':["1f1e6-1f1ff"],':bs:':["1f1e7-1f1f8"],':bh:':["1f1e7-1f1ed"],':bd:':["1f1e7-1f1e9"],':bb:':["1f1e7-1f1e7"],':by:':["1f1e7-1f1fe"],':be:':["1f1e7-1f1ea"],':bz:':["1f1e7-1f1ff"],':bj:':["1f1e7-1f1ef"],':bt:':["1f1e7-1f1f9"],':bo:':["1f1e7-1f1f4"],':ba:':["1f1e7-1f1e6"],':bw:':["1f1e7-1f1fc"],':br:':["1f1e7-1f1f7"],':bn:':["1f1e7-1f1f3"],':bg:':["1f1e7-1f1ec"],':bf:':["1f1e7-1f1eb"],':bi:':["1f1e7-1f1ee"],':kh:':["1f1f0-1f1ed"],':cm:':["1f1e8-1f1f2"],':ca:':["1f1e8-1f1e6"],':cv:':["1f1e8-1f1fb"],':cf:':["1f1e8-1f1eb"],':td:':["1f1f9-1f1e9"],':chile:':["1f1e8-1f1f1"],':co:':["1f1e8-1f1f4"],':km:':["1f1f0-1f1f2"],':cr:':["1f1e8-1f1f7"],':ci:':["1f1e8-1f1ee"],':hr:':["1f1ed-1f1f7"],':cu:':["1f1e8-1f1fa"],':cy:':["1f1e8-1f1fe"],':cz:':["1f1e8-1f1ff"],':congo:':["1f1e8-1f1e9"],':dk:':["1f1e9-1f1f0"],':dj:':["1f1e9-1f1ef"],':dm:':["1f1e9-1f1f2"],':do:':["1f1e9-1f1f4"],':tl:':["1f1f9-1f1f1"],':ec:':["1f1ea-1f1e8"],':eg:':["1f1ea-1f1ec"],':sv:':["1f1f8-1f1fb"],':gq:':["1f1ec-1f1f6"],':er:':["1f1ea-1f1f7"],':ee:':["1f1ea-1f1ea"],':et:':["1f1ea-1f1f9"],':fj:':["1f1eb-1f1ef"],':fi:':["1f1eb-1f1ee"],':ga:':["1f1ec-1f1e6"],':gm:':["1f1ec-1f1f2"],':ge:':["1f1ec-1f1ea"],':gh:':["1f1ec-1f1ed"],':gr:':["1f1ec-1f1f7"],':gd:':["1f1ec-1f1e9"],':gt:':["1f1ec-1f1f9"],':gn:':["1f1ec-1f1f3"],':gw:':["1f1ec-1f1fc"],':gy:':["1f1ec-1f1fe"],':ht:':["1f1ed-1f1f9"],':hn:':["1f1ed-1f1f3"],':hu:':["1f1ed-1f1fa"],':is:':["1f1ee-1f1f8"],':in:':["1f1ee-1f1f3"],':indonesia:':["1f1ee-1f1e9"],':ir:':["1f1ee-1f1f7"],':iq:':["1f1ee-1f1f6"],':ie:':["1f1ee-1f1ea"],':il:':["1f1ee-1f1f1"],':jm:':["1f1ef-1f1f2"],':jo:':["1f1ef-1f1f4"],':kz:':["1f1f0-1f1ff"],':ke:':["1f1f0-1f1ea"],':ki:':["1f1f0-1f1ee"],':xk:':["1f1fd-1f1f0"],':kw:':["1f1f0-1f1fc"],':kg:':["1f1f0-1f1ec"],':la:':["1f1f1-1f1e6"],':lv:':["1f1f1-1f1fb"],':lb:':["1f1f1-1f1e7"],':ls:':["1f1f1-1f1f8"],':lr:':["1f1f1-1f1f7"],':ly:':["1f1f1-1f1fe"],':li:':["1f1f1-1f1ee"],':lt:':["1f1f1-1f1f9"],':lu:':["1f1f1-1f1fa"],':mk:':["1f1f2-1f1f0"],':mg:':["1f1f2-1f1ec"],':mw:':["1f1f2-1f1fc"],':my:':["1f1f2-1f1fe"],':mv:':["1f1f2-1f1fb"],':ml:':["1f1f2-1f1f1"],':mt:':["1f1f2-1f1f9"],':mh:':["1f1f2-1f1ed"],':mr:':["1f1f2-1f1f7"],':mu:':["1f1f2-1f1fa"],':mx:':["1f1f2-1f1fd"],':fm:':["1f1eb-1f1f2"],':md:':["1f1f2-1f1e9"],':mc:':["1f1f2-1f1e8"],':mn:':["1f1f2-1f1f3"],':me:':["1f1f2-1f1ea"],':ma:':["1f1f2-1f1e6"],':mz:':["1f1f2-1f1ff"],':mm:':["1f1f2-1f1f2"],':na:':["1f1f3-1f1e6"],':nr:':["1f1f3-1f1f7"],':np:':["1f1f3-1f1f5"],':nl:':["1f1f3-1f1f1"],':nz:':["1f1f3-1f1ff"],':ni:':["1f1f3-1f1ee"],':ne:':["1f1f3-1f1ea"],':nigeria:':["1f1f3-1f1ec"],':kp:':["1f1f0-1f1f5"],':no:':["1f1f3-1f1f4"],':om:':["1f1f4-1f1f2"],':pk:':["1f1f5-1f1f0"],':pw:':["1f1f5-1f1fc"],':pa:':["1f1f5-1f1e6"],':pg:':["1f1f5-1f1ec"],':py:':["1f1f5-1f1fe"],':pe:':["1f1f5-1f1ea"],':ph:':["1f1f5-1f1ed"],':pl:':["1f1f5-1f1f1"],':pt:':["1f1f5-1f1f9"],':qa:':["1f1f6-1f1e6"],':tw:':["1f1f9-1f1fc"],':cg:':["1f1e8-1f1ec"],':ro:':["1f1f7-1f1f4"],':rw:':["1f1f7-1f1fc"],':kn:':["1f1f0-1f1f3"],':lc:':["1f1f1-1f1e8"],':vc:':["1f1fb-1f1e8"],':ws:':["1f1fc-1f1f8"],':sm:':["1f1f8-1f1f2"],':st:':["1f1f8-1f1f9"],':saudiarabia:':["1f1f8-1f1e6"],':saudi:':["1f1f8-1f1e6"],':sn:':["1f1f8-1f1f3"],':rs:':["1f1f7-1f1f8"],':sc:':["1f1f8-1f1e8"],':sl:':["1f1f8-1f1f1"],':sg:':["1f1f8-1f1ec"],':sk:':["1f1f8-1f1f0"],':si:':["1f1f8-1f1ee"],':sb:':["1f1f8-1f1e7"],':so:':["1f1f8-1f1f4"],':za:':["1f1ff-1f1e6"],':lk:':["1f1f1-1f1f0"],':sd:':["1f1f8-1f1e9"],':sr:':["1f1f8-1f1f7"],':sz:':["1f1f8-1f1ff"],':se:':["1f1f8-1f1ea"],':ch:':["1f1e8-1f1ed"],':sy:':["1f1f8-1f1fe"],':tj:':["1f1f9-1f1ef"],':tz:':["1f1f9-1f1ff"],':th:':["1f1f9-1f1ed"],':tg:':["1f1f9-1f1ec"],':to:':["1f1f9-1f1f4"],':tt:':["1f1f9-1f1f9"],':tn:':["1f1f9-1f1f3"],':tr:':["1f1f9-1f1f7"],':turkmenistan:':["1f1f9-1f1f2"],':tuvalu:':["1f1f9-1f1fb"],':ug:':["1f1fa-1f1ec"],':ua:':["1f1fa-1f1e6"],':ae:':["1f1e6-1f1ea"],':uy:':["1f1fa-1f1fe"],':uz:':["1f1fa-1f1ff"],':vu:':["1f1fb-1f1fa"],':va:':["1f1fb-1f1e6"],':ve:':["1f1fb-1f1ea"],':vn:':["1f1fb-1f1f3"],':eh:':["1f1ea-1f1ed"],':ye:':["1f1fe-1f1ea"],':zm:':["1f1ff-1f1f2"],':zw:':["1f1ff-1f1fc"],':pr:':["1f1f5-1f1f7"],':ky:':["1f1f0-1f1fe"],':bm:':["1f1e7-1f1f2"],':pf:':["1f1f5-1f1eb"],':ps:':["1f1f5-1f1f8"],':nc:':["1f1f3-1f1e8"],':sh:':["1f1f8-1f1ed"],':aw:':["1f1e6-1f1fc"],':vi:':["1f1fb-1f1ee"],':hk:':["1f1ed-1f1f0"],':ac:':["1f1e6-1f1e8"],':ms:':["1f1f2-1f1f8"],':gu:':["1f1ec-1f1fa"],':gl:':["1f1ec-1f1f1"],':nu:':["1f1f3-1f1fa"],':wf:':["1f1fc-1f1eb"],':mo:':["1f1f2-1f1f4"],':fo:':["1f1eb-1f1f4"],':fk:':["1f1eb-1f1f0"],':je:':["1f1ef-1f1ea"],':ai:':["1f1e6-1f1ee"],':gi:':["1f1ec-1f1ee"]};

	//"

    ns.asciiList = {
        '<3':'2764',
        '</3':'1f494',
        ':\')':'1f602',
        ':\'-)':'1f602',
        ':D':'1f603',
        ':-D':'1f603',
        '=D':'1f603',
        ':)':'1f604',
        ':-)':'1f604',
        '=]':'1f604',
        '=)':'1f604',
        ':]':'1f604',
        '\':)':'1f605',
        '\':-)':'1f605',
        '\'=)':'1f605',
        '\':D':'1f605',
        '\':-D':'1f605',
        '\'=D':'1f605',
        '>:)':'1f606',
        '>;)':'1f606',
        '>:-)':'1f606',
        '>=)':'1f606',
        ';)':'1f609',
        ';-)':'1f609',
        '*-)':'1f609',
        '*)':'1f609',
        ';-]':'1f609',
        ';]':'1f609',
        ';D':'1f609',
        ';^)':'1f609',
        '\':(':'1f613',
        '\':-(':'1f613',
        '\'=(':'1f613',
        ':*':'1f618',
        ':-*':'1f618',
        '=*':'1f618',
        ':^*':'1f618',
        '>:P':'1f61c',
        'X-P':'1f61c',
        'x-p':'1f61c',
        '>:[':'1f61e',
        ':-(':'1f61e',
        ':(':'1f61e',
        ':-[':'1f61e',
        ':[':'1f61e',
        '=(':'1f61e',
        '>:(':'1f620',
        '>:-(':'1f620',
        ':@':'1f620',
        ':\'(':'1f622',
        ':\'-(':'1f622',
        ';(':'1f622',
        ';-(':'1f622',
        '>.<':'1f623',
        ':$':'1f633',
        '=$':'1f633',
        '#-)':'1f635',
        '#)':'1f635',
        '%-)':'1f635',
        '%)':'1f635',
        'X)':'1f635',
        'X-)':'1f635',
        '*\\0/*':'1f646',
        '\\0/':'1f646',
        '*\\O/*':'1f646',
        '\\O/':'1f646',
        'O:-)':'1f607',
        '0:-3':'1f607',
        '0:3':'1f607',
        '0:-)':'1f607',
        '0:)':'1f607',
        '0;^)':'1f607',
        'O:)':'1f607',
        'O;-)':'1f607',
        'O=)':'1f607',
        '0;-)':'1f607',
        'O:-3':'1f607',
        'O:3':'1f607',
        'B-)':'1f60e',
        '8-)':'1f60e',
        'B-D':'1f60e',
        '8-D':'1f60e',
        '-_-':'1f611',
        '-__-':'1f611',
        '-___-':'1f611',
        '>:\\':'1f615',
        '>:/':'1f615',
        ':-/':'1f615',
        ':-.':'1f615',
        ':/':'1f615',
        ':\\':'1f615',
        '=/':'1f615',
        '=\\':'1f615',
        ':L':'1f615',
        '=L':'1f615',
        ':P':'1f61b',
        ':-P':'1f61b',
        '=P':'1f61b',
        ':-p':'1f61b',
        ':p':'1f61b',
        '=p':'1f61b',
        ':-Þ':'1f61b',
        ':Þ':'1f61b',
        ':þ':'1f61b',
        ':-þ':'1f61b',
        ':-b':'1f61b',
        ':b':'1f61b',
        'd:':'1f61b',
        ':-O':'1f62e',
        ':O':'1f62e',
        ':-o':'1f62e',
        ':o':'1f62e',
        'O_O':'1f62e',
        '>:O':'1f62e',
        ':-X':'1f636',
        ':X':'1f636',
        ':-#':'1f636',
        ':#':'1f636',
        '=X':'1f636',
        '=x':'1f636',
        ':x':'1f636',
        ':-x':'1f636',
        '=#':'1f636'
    };

	// Looks like someone tried to add ^_^ but it's missing above
    ns.asciiRegexp = '\\^_\\^|KeyWord|\\<3|&lt;3|\\<\\/3|&lt;\\/3|\\:\'\\)|\\:\'\\-\\)|\\:D|\\:\\-D|\\=D|\\:\\)|\\:\\-\\)|\\=\\]|\\=\\)|\\:\\]|\'\\:\\)|\'\\:\\-\\)|\'\\=\\)|\'\\:D|\'\\:\\-D|\'\\=D|\\>\\:\\)|&gt;\\:\\)|\\>;\\)|&gt;;\\)|\\>\\:\\-\\)|&gt;\\:\\-\\)|\\>\\=\\)|&gt;\\=\\)|;\\)|;\\-\\)|\\*\\-\\)|\\*\\)|;\\-\\]|;\\]|;D|;\\^\\)|\'\\:\\(|\'\\:\\-\\(|\'\\=\\(|\\:\\*|\\:\\-\\*|\\=\\*|\\:\\^\\*|\\>\\:P|&gt;\\:P|X\\-P|x\\-p|\\>\\:\\[|&gt;\\:\\[|\\:\\-\\(|\\:\\(|\\:\\-\\[|\\:\\[|\\=\\(|\\>\\:\\(|&gt;\\:\\(|\\>\\:\\-\\(|&gt;\\:\\-\\(|\\:@|\\:\'\\(|\\:\'\\-\\(|;\\(|;\\-\\(|\\>\\.\\<|&gt;\\.&lt;|\\:\\$|\\=\\$|#\\-\\)|#\\)|%\\-\\)|%\\)|X\\)|X\\-\\)|\\*\\\\0\\/\\*|\\\\0\\/|\\*\\\\O\\/\\*|\\\\O\\/|O\\:\\-\\)|0\\:\\-3|0\\:3|0\\:\\-\\)|0\\:\\)|0;\\^\\)|O\\:\\-\\)|O\\:\\)|O;\\-\\)|O\\=\\)|0;\\-\\)|O\\:\\-3|O\\:3|B\\-\\)|B\\)|8\\)|8\\-\\)|B\\-D|8\\-D|\\-_\\-|\\-__\\-|\\-___\\-|\\>\\:\\\\|&gt;\\:\\\\|\\>\\:\\/|&gt;\\:\\/|\\:\\-\\/|\\:\\-\\.|\\:\\/|\\:\\\\|\\=\\/|\\=\\\\|\\:L|\\=L|\\:P|\\:\\-P|\\=P|\\:\\-p|\\:p|\\=p|\\:\\-Þ|\\:\\-&THORN;|\\:Þ|\\:&THORN;|\\:þ|\\:&thorn;|\\:\\-þ|\\:\\-&thorn;|\\:\\-b|\\:b|d\\:|\\:\\-O|\\:O|\\:\\-o|\\:o|O_O|\\>\\:O|&gt;\\:O|\\:\\-X|\\:X|\\:\\-#|\\:#|\\=X|\\=x|\\:x|\\:\\-x|\\=#';

    ns.shortnameRegexp = ':([-+\\w]+):';
    ns.imagePathPNG = '//cdn.jsdelivr.net/emojione/assets/png/';
    ns.imagePathSVG = '//cdn.jsdelivr.net/emojione/assets/svg/';
    ns.imageType = 'png'; // or svg
    ns.cacheBustParam = '?v=1.2.4'; // you can [optionally] modify this to force browsers to refresh their cache. it will be appended to the send of the filenames

    // TODO: Remove me or fix me (it doesn't add to the regex) //
    ns.addAscii = function(key,code) {
    	ns.asciiList[key] = code;
    	console.log(key);
    };

    ns.shortnameImage = function(shortname) {
        if( (typeof shortname === 'undefined') || (shortname === '') || (!(shortname in ns.emojioneList)) ) {
            // if the shortname doesnt exist just return the entire match
            return shortname;
        }
        else {
            unicode = ns.emojioneList[shortname][ns.emojioneList[shortname].length-1].toUpperCase();

            alt = ns.convert(unicode);

            if(ns.imageType === 'png') {
                replaceWith = '<img class="emojione" alt="'+alt+'" title="'+shortname+'" src="'+ns.imagePathPNG+unicode+'.png'+ns.cacheBustParam+'"/>';
            }
            else {
                replaceWith = '<object class="emojione" data="'+ns.imagePathSVG+unicode+'.svg'+ns.cacheBustParam+'" type="image/svg+xml" standby="'+alt+'">'+alt+'</object>';
            }

            return replaceWith;
        }
    }

    ns.shortnameToImage = function(str,ascii) {
    	// replace regular shortnames first
        var replaceWith,unicode,alt;
        str = str.replace(new RegExp("<object[^>]*>.*?<\/object>|<span[^>]*>.*?<\/span>|<(?:object|embed|svg|img|div|span|p|a)[^>]*>|("+ns.shortnameRegexp+")", "gi"),function(shortname) {
            if( (typeof shortname === 'undefined') || (shortname === '') || (!(shortname in ns.emojioneList)) ) {
                // if the shortname doesnt exist just return the entire match
                return shortname;
            }
            else {
                unicode = ns.emojioneList[shortname][ns.emojioneList[shortname].length-1].toUpperCase();

                alt = ns.convert(unicode);

                if(ns.imageType === 'png') {
                    replaceWith = '<img class="emojione" alt="'+alt+'" title="'+shortname+'" src="'+ns.imagePathPNG+unicode+'.png'+ns.cacheBustParam+'"/>';
                }
                else {
                    replaceWith = '<object class="emojione" data="'+ns.imagePathSVG+unicode+'.svg'+ns.cacheBustParam+'" type="image/svg+xml" standby="'+alt+'">'+alt+'</object>';
                }

                return replaceWith;
            }
        });

        // if ascii smileys are turned on, then we'll replace them!
        if ( ascii || typeof ascii === 'undefined' ) {
            str = str.replace(new RegExp("<object[^>]*>.*?<\/object>|<span[^>]*>.*?<\/span>|<(?:object|embed|svg|img|div|span|p|a)[^>]*>|(()("+ns.asciiRegexp+")())","g"),function(entire, m1, m2, m3) {
//            	// Debug //
//            	if (entire[0] !== "<") {
//            		console.log("Pattern: \""+entire+"\" [ \""+m1+"\", \""+m2+"\", \""+m3+"\" ]");
//            	}

                if( (typeof m3 === 'undefined') || (m3 === '') || (!(ns.unescapeHTML(m3) in ns.asciiList)) ) {
                    // if the shortname doesnt exist just return the entire match
                    return entire;
                }

                m3 = ns.unescapeHTML(m3);
                unicode = ns.asciiList[m3].toUpperCase();

                alt = ns.convert(unicode);

                if(ns.imageType === 'png') {
                    replaceWith = m2+'<img class="emojione" alt="'+ns.escapeHTML(m3)+'" title="'+ns.escapeHTML(m3)+'" src="'+ns.imagePathPNG+unicode+'.png'+ns.cacheBustParam+'"/>';
                }
                else {
                    replaceWith = m2+'<object class="emojione" data="'+ns.imagePathSVG+unicode+'.svg'+ns.cacheBustParam+'" type="image/svg+xml" standby="'+alt+'">'+alt+'</object>';
                }

                return replaceWith;
            });
        }

        return str;
    };

    // super simple loop to replace all unicode emoji to shortnames
    // needs to be improved into one big replacement instead, for performance reasons
    ns.toShort = function(str) { // this is really just unicodeToShortname() but I opted for the shorthand name to match toImage()
        for (var shortcode in ns.emojioneList) {
            if (!ns.emojioneList.hasOwnProperty(shortcode)) { continue; }
            for(var i = 0, len = ns.emojioneList[shortcode].length; i < len; i++){
                var unicode = ns.emojioneList[shortcode][i].toUpperCase();
                str = ns.replaceAll(str,ns.convert(unicode),shortcode);
            }
        }
        return str;
    };

    // for converting unicode code points and code pairs to their respective characters
    ns.convert = function(unicode) {
        if(unicode.indexOf("-") > -1) {
            var parts = [];
            var s = unicode.split('-');
            for(var i = 0; i < s.length; i++) {
                var part = Number(s[i], 16);
                if (part >= 0x10000 && part <= 0x10FFFF) {
                    var hi = Math.floor((part - 0x10000) / 0x400) + 0xD800;
                    var lo = ((part - 0x10000) % 0x400) + 0xDC00;
                    part = (String.fromCharCode(hi) + String.fromCharCode(lo));
                }
                else {
                    part = String.fromCharCode(part);
                }
                parts.push(part);
            }
            return parts.join('');
        }
        else {
            var s = Number(unicode, 16);
            if (s >= 0x10000 && s <= 0x10FFFF) {
                var hi = Math.floor((s - 0x10000) / 0x400) + 0xD800;
                var lo = ((s - 0x10000) % 0x400) + 0xDC00;
                return (String.fromCharCode(hi) + String.fromCharCode(lo));
            }
            else {
                return String.fromCharCode(s);
            }
        }
    };

    ns.escapeHTML = function (string) {
        var escaped = {
            '&' : '&amp;',
            '<' : '&lt;',
            '>' : '&gt;',
            '"' : '&quot;',
            '\'': '&#039;'
        };

        return string.replace(/[&<>"']/g, function (match) {	//"
            return escaped[match];
        });
    };

    ns.unescapeHTML = function (string) {
        var unescaped = {
            '&amp;'  : '&',
            '&#38;'  : '&',
            '&#x26;' : '&',
            '&lt;'   : '<',
            '&#60;'  : '<',
            '&#x3C;' : '<',
            '&gt;'   : '>',
            '&#62;'  : '>',
            '&#x3E;' : '>',
            '&quot;' : '"',
            '&#34;'  : '"',
            '&#x22;' : '"',
            '&apos;' : '\'',
            '&#39;'  : '\'',
            '&#x27;' : '\''
        };

        return string.replace(/&(?:amp|#38|#x26|lt|#60|#x3C|gt|#62|#x3E|apos|#39|#x27|quot|#34|#x22);/ig, function (match) {
            return unescaped[match];
        });
    };

    ns.replaceAll = function(string, find, replaceWith) {
        var search = new RegExp("<object[^>]*>.*?<\/object>|<span[^>]*>.*?<\/span>|<(?:object|embed|svg|img|div|span|p|a)[^>]*>|("+find+")", "gi");

        // callback prevents replacing anything inside of these common html tags as well as between an <object></object> tag
        var replace = function(entire, m1) {
            return ((typeof  m1 === 'undefined') || (m1 === '')) ? entire : replaceWith;
        };

        return string.replace(search,replace);
    };

}(this.emojione = this.emojione || {}));
if(typeof module === "object") module.exports = this.emojione;
