# Realify 🟦🧘🎧

🧑‍💻 To run the app:

- `yarn install`
- (iOS: `cd iOS && pod install`)
- iOS: `yarn ios --simulator='<simulator-name>'`
- Android: `yarn android`
- Not hearing anything?
  - https://stackoverflow.com/questions/302399/sound-not-working-in-iphone-simulator
  - https://stackoverflow.com/questions/8265202/no-sound-coming-from-android-emulator

🆒 things to notice:

- The Player view: drag it to check how the tab bar moves and fades in/out.
- If you drag the song list when is at the top, the artist cover will make a cool effect.
- I added song shuffling! It's nothing special, it just picks a random song, but it works :-) and you can activate it from different views.
- You can pause and play right from the MiniPlayer!
- When you finish playing the list, it will pause and will set the first song as the current one.
- I made an icon 🟦

Misc Notes:

- I took some design inspiration from the Spotify app but using some of the Real design language (mostly colors and fonts).
- Some functionalities "don't work", like presing the Search and Home tabs, since I just wanted to add them to make the app look more _real_.
- I didn't have much time to create tests. Sorry about that!

🧐 Logic notes:

- It would've been better to use redux to make it easier to share state between components.
- It would've been better to make `<Player>` smart and not controlled, except by listening to redux state.
- Maybe it would have been better to fetch songs instead of bundling them because they make the app bigger in size, but in this case, I didn't have to add a lot of songs. In any other case, it would be better to fetch them (or stream them).
- Instead of keeping a `isPlaying, durationMillis, currentPositionMillis` local state, I should have used the ones from the current media. It's cleaner that way.
