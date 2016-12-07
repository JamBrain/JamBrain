# Flip Clock Component Documentation

When requiring the Clock, first import the Flip Clock Component at the start of your file.
```
import ClockFlip from 'com/clock-flip/flip';
```
Now to use the Clock Component, simply insert `<ClockFlip date={ new Date() } />` in the render function.

### Arguments
The Flip Clock Component contains many arguments that affect the function of the component. 

#### Date
`<ClockFlip date={ new Date() } />`
The date is the one argument that the Clock Component needs. As seen above the date argument requires a Date object. The date argument is what the countdown clock will countdown to.

#### comSize
`<ClockFlip date={ new Date() } comSize="1.5" />`
*DEFAULT_VALUE: 1*
When this argument is set, it affects the size of the Clock Component. This argument will accept any variable that is considered a number.

#### class
`<ClockFlip date={ new Date() } class="not-mobile" />` 
When this argument is set, it allows you to add custom class to the component. Certain classes like 'not-mobile' or 'mobile-only' allow you to show the component on mobile devices or not.

#### h1 & h2
`<ClockFlip date={ new Date() } h1="Countdown" h2="To" />`
h1 & h2 are the headers for the countdown clock. 'h1' is the unbolded word(s), where as 'h2' is the bolded word(s). This argument is best to take a number or string, however should be able to accept any object type that has an output.

#### displayAfterDays
`<ClockFlip date={ new Date() } displayAfterDays={ 2 } />`
*DEFAULT VALUE: 1*
displayAfterDays when not set will default to 1. (if displayAfterHours is not set, this argument will not do anything.) This argument will allow the clock to be hidden until there are *less than* displayAfterHours left on the countdown. In order to use this, at the current time you must set displayAfterHours={ 24 }.

#### displayAfterHours
`<ClockFlip date={ new Date() } displayAfterHours={ 2 } />`
*DEFAULT VALUE: null*
When not set, the clock will always display. 'displayAfterHours' allows you to hide the clock until the remaining hours left is *less than* displayAfterHours. If this is used in conjuction with displayAfterDays, at this current time this needs to be set to 24. However, when displayAfterDays is not set this will only display the clock as in intended.

#### urgentAfterHours
`<ClockFlip date={ new Date() } urgentAfterHours={ 2 } />`
*DEFAULT VALUE: null*
When 'urgentAfterHours' is set, once the remaining hours on the countdown is *less than* urgentAfterHours the styling on the countdown clock will change in order to grab eye attention. Currently the colour of the text changes to the Ludum Dares primary colour.

#### jumbo
`<ClockFlip date={ new Date() } jumbo={true} />`
*DEFAULT VALUE: false*
When this argument is set to true, the clock will always display in the format dd:hh:mm:ss, if this argument is not set or is set to false, the clock will automatically switch between the following formats dd:hh:mm, hh:mm:ss. This switch will occur when there is less than 1 day to go on the countdown clock. 
