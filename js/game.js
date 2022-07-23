const game = {

    init() {
        game.audios.loadAudios();

        game.controls.elements.ledsList = document.querySelectorAll("div.led");

        game.controls.elements.commandComputer = document.querySelector('div.command');

        game.controls.elements.buttonsComputer = document.querySelector('div.buttons.computer');
        game.controls.elements.buttonsComputerList = document.querySelectorAll("div.buttons.computer > div");
        game.controls.elements.ledsComputerList = document.querySelectorAll("div.leds.computer > div");

        game.controls.elements.buttonsPlayer = document.querySelector('div.buttons.player');
        game.controls.elements.buttonsPlayerList = document.querySelectorAll("div.buttons.player > div");
        game.controls.elements.ledsPlayerList = document.querySelectorAll("div.leds.player > div");


        game.controls.playerButton.block(true);
        game.controls.playerButton.lightLockedButtons(false);
    },

    startGame() {
        game.started = true;
        game.audios.start.play().then(function () {
            game.turnOffLeds();
            game.controls.elements.buttonsComputer.classList.remove("hidden");
            game.controls.elements.commandComputer.classList.add("hidden");
            game.controls.indexSequenceComputer = 1;
            game.controls.indexSequencePlayer = 0;
            game.controls.computerSequence = Array.from({length: game.controls.indexMaxSequence}, () => {
                return Math.floor(Math.random() * game.controls.indexMaxSequence);
            });
            game.playComputerSequence();
        });
    },

    gameOver() {
        game.started = false;

        game.audios.fail.play().then(function () {
            game.controls.playerButton.block(true);
            game.controls.playerButton.lightLockedButtons(false);
            game.turnOffLeds();

            game.controls.elements.buttonsComputer.classList.add("hidden");
            game.controls.elements.commandComputer.classList.remove("hidden");
        });

    },

    gameCompleted() {
        const delay = 2000;
        game.ledsController(null, 'winner', true, null);
        game.audios.complete.play().then(function () {
            game.startGame();
        });
        setTimeout(function () {
            game.ledsController(null, 'winner', false, null);
        }, delay);

    },

    turnOffLeds() {
        game.ledsController(null, 'turnOn', false, null);
    },

    controls: {
        started: false,
        indexSequenceComputer: 1,
        indexSequencePlayer: 0,
        indexMaxSequence: 5,
        computerSequence: [1, 4, 5, 2, 6, 3],
        playerSequence: [],
        elements: {
            buttonsComputer: null,
            buttonsComputerList: null,
            commandComputer: null,
        },
        playerButton: {

            block(lock) {
                game.controls.playerButton.lockedButtons(lock);
                game.controls.playerButton.lightLockedButtons(lock);
            },

            lockedButtons(lock) {
                if (lock) {
                    game.controls.elements.buttonsPlayer.classList.add("lock");
                } else {
                    game.controls.elements.buttonsPlayer.classList.remove("lock");
                }
            },

            lightLockedButtons(lock) {
                if (lock) {
                    game.controls.elements.buttonsPlayer.classList.add("lightLockedButtons");
                } else {
                    game.controls.elements.buttonsPlayer.classList.remove("lightLockedButtons");
                }
            },
        }
    },



    ledsController(index, idclass, add, isComputer) {
        let leds;

        if (index === null) {
            leds = game.controls.elements.ledsList;
        } else if (isComputer === true) {
            leds = [game.controls.elements.ledsComputerList[index]];
        } else {
            leds = [game.controls.elements.ledsPlayerList[index]];
        }

        for (let i in leds) {
            try {
                if (add === true) {
                    leds[i].classList.add(`${idclass}`);
                } else {
                    leds[i].classList.remove(`${idclass}`);
                }
            } catch (error) {
            }
        }
    },


    clickPainelButton: function (index, isComputer = false) {
        const delayInMilliseconds = 300;

        let buttons;
        if (isComputer === true) {
            buttons = game.controls.elements.buttonsComputerList;
        } else {
            buttons = game.controls.elements.buttonsPlayerList;
        }
        buttons[index].classList.add("active");
        game.audios.painelButtonAudios[index].play().then(function () {
            setTimeout(function () {
                buttons[index].classList.remove("active");
            }, delayInMilliseconds);
        });
    },



    audios: {
        start: 'start.mp3',
        fail: 'fail.mp3',
        complete: 'complete.mp3',
        painelButtonAudios: ['0.mp3', '1.mp3', '2.mp3', '3.mp3', '4.mp3', '5.mp3', '6.mp3', '7.mp3', '8.mp3'],
        loadAudio(filename) {
            const file = `./audio/${filename}?cb=${new Date().getTime()}`;
            const audio = new Audio(file);
            audio.load();
            return audio;
        },

        loadAudios() {
            if (typeof (game.audios.start) === "object") return;
            game.audios.start = game.audios.loadAudio(game.audios.start);
            game.audios.complete = game.audios.loadAudio(game.audios.complete);
            game.audios.fail = game.audios.loadAudio(game.audios.fail);
            game.audios.painelButtonAudios = game.audios.painelButtonAudios.map((value) => game.audios.loadAudio(value));
        }
    },

    playComputerSequence() {

        const turnOnLed = true;
        const isComputer = true;
        const delayInMilliseconds = 400;
        const delayInitInMilliseconds = 1000;
        const waitingTime = (delayInMilliseconds * game.controls.indexSequenceComputer) + (2 * delayInitInMilliseconds);

        game.controls.playerSequence = [];

        game.controls.playerButton.block(true);
        game.controls.playerButton.lightLockedButtons(false);


        setTimeout(() => {
            game.controls.playerButton.lightLockedButtons(true);

            for (var i = 0; i < game.controls.indexSequenceComputer; i++) {
                let index = i;
                setTimeout(() => {
                    game.ledsController(index, 'turnOn', true, isComputer);
                    game.clickPainelButton(
                        game.controls.computerSequence[index], true);
                }, delayInMilliseconds * (index + 1));
            }
        }, delayInitInMilliseconds);

        setTimeout(() => {

            game.controls.playerButton.block(false);

        }, waitingTime);



    },

    playPlayerSequence(index) {
        const turnOnLed = true;
        const isComputer = false;
        try {
            game.clickPainelButton(index, false);
            game.controls.playerSequence.push(index);
            for (let i in game.controls.playerSequence) {
                if (game.controls.playerSequence[i] !== game.controls.computerSequence[i]) {
                    throw "Errou a sequência de jogo";
                }
            }

            if (game.controls.playerSequence.length > game.controls.indexSequencePlayer) {
                game.ledsController(game.controls.indexSequencePlayer, 'turnOn', true, isComputer);
                game.controls.indexSequencePlayer += 1;

                if (game.controls.indexSequencePlayer < game.controls.indexMaxSequence) {
                    game.controls.indexSequenceComputer += 1;
                    game.playComputerSequence();
                } else {
                    game.gameCompleted();
                }

            }

        } catch (error) {
            game.gameOver();
        }
    }

};