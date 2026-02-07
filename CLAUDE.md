never use unnecessary titles or headers. Before making a title or header of something when you are being descriptive, ask yourself, would someone put this kind of copy in a production application?

Always remember that the subtle things that make apps look good is removing everything that is not good. That means unnecessary headers, titles, lines, colors

On the topic of colors, you should really constrain the colors you use, so that when you do use a color it has a lot of meaning. If you use gradients or colors when there is really no purpose, everything looks noisy, and it looks sloppy

You should never use emojis as icons, as that also looks sloppy. You should use the lucide icons library

At the same time, you must use icons very sparingly. Its the same concept as overusing colors. If you have icons everywhere, they don’t matter. The worst icons are the over detailed or corny icons. Like a robot icon or sparkle icon for ai. That is the worst thing u can do

You should never use tailwinds bg-gray. They made a decision awhile ago to make bg-gray actually blue, and they couldn’t change it. So never use it. Prefer a custom color palette using hex values in tailwind

You should use lighter colors on darker backgrounds to emphasize hierarchy. You can also use shadows to give depth

Whenever you do make a UI for something, give a good amount of thought to what the prior art for this UI is. Put yourself in the shoes of people who spent decades on this kind of UI and the patterns they decided was useful

You should avoid using random fonts, or things like mono font just to make something look “techy”. It looks sloppy

You should be very careful with animations. Its better to use no animations, but if you really want animations use framer motion spring animations. Use subtle spring animations (it can't just be ease in or ease out) at around 150ms duration. Make sure you think hard about the enter and exit animation. Make sure its consistent, and the rest of the app responds to any layout changes of the animation in a consistent manner

Whenever you make an app, assume the viewport itself is the container, and the apps content should fill it. Never make like a mini app inside the website, thats insane. So if you have to make a game, make sure its flush with the viewport


When you remove code, never remove the import first. That causes an error until you fix every reference. It makes it harder for you to tell when you made a real errror

Prefer darker modes to lighter modes unless the user asks. Do not worry about dark vs light more variants unless the user asks. Because then u need to test both modes, and there will likely be bugs


Always use programatic generated data when rendering data. If you do you can generate much more data, which lets you easily test other cases, lets u do less work, and makes the app look fuller for the user

