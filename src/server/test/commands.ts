mp.events.addCommand('hp', (player, fullText, hp) => {
  console.log(fullText);
  console.log(hp);
  player.health = Number(hp);
});

mp.events.addCommand('armod', (player) => {
  player.armour = 100;
});

mp.events.add('playerDeath', (player) => {
  player.spawn(new mp.Vector3(-425.517, 1123.62, 325.8544));
  player.health = 100;
});

mp.events.addCommand('car', (player) => {
  player.spawn(
    new mp.Vector3({
      x: -425.517,
      y: 1123.62,
      z: 325.8544,
    }),
  );
  mp.vehicles.new(
    'prairie',
    new mp.Vector3({
      x: -425.517,
      y: 1123.62,
      z: 325.8544,
    }),
  );
});
