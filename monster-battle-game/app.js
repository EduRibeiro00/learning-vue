// ----------------
// CONSTANTS
const consts = {
    // max health points
    MAX_HEALTH: 100,

    // damage for the player
    MIN_ATTACK_DMG: 3,
    MAX_ATTACK_DMG: 10,
    MIN_SP_ATTACK_DMG: 10,
    MAX_SP_ATTACK_DMG: 20,

    // damage for the monster
    MIN_MONSTER_DMG: 5,
    MAX_MONSTER_DMG: 12,

    // heal points
    HEAL_POINTS: 8
}

const actions = Object.freeze({
    PLAYER_ATTACK: 0,
    PLAYER_SP_ATTACK: 1,
    MONSTER_ATTACK: 2,
    HEAL: 3
})

// ----------------
// HELPER FUNCTIONS
const calcDamage =  function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

// ----------------
// VUE
new Vue({
    el: '#app',
    data: {
        playerHealth: consts.MAX_HEALTH,
        monsterHealth: consts.MAX_HEALTH,
        gameIsRunning: false,
        turns: []
    },
    methods: {
        startGame: function() {
            this.gameIsRunning = true
            this.playerHealth = consts.MAX_HEALTH
            this.monsterHealth = consts.MAX_HEALTH
            this.turns = []
        },
        attack: function() {
            this.doAttackTurn(actions.PLAYER_ATTACK, consts.MIN_ATTACK_DMG, consts.MAX_ATTACK_DMG)
        },
        specialAttack: function() {
            this.doAttackTurn(actions.PLAYER_SP_ATTACK, consts.MIN_SP_ATTACK_DMG, consts.MAX_SP_ATTACK_DMG)
        },
        heal: function() {
            let healthHealed = this.playerHealth > (consts.MAX_HEALTH - consts.HEAL_POINTS) ? (consts.MAX_HEALTH - this.playerHealth) : consts.HEAL_POINTS
            this.playerHealth += healthHealed
            this.addActionToLog(actions.HEAL, healthHealed)
            this.doMonsterAttack()
        },
        giveUp: function() {
            this.gameIsRunning = false
        },
        checkEnd: function() {
            if (this.monsterHealth <= 0) {
                this.showEndMessage('You won! New game?')
                return true
            }
            else if (this.playerHealth <= 0) {
                this.showEndMessage('You lost... New game?')
                return true
            }
            return false
        },
        showEndMessage: function(msg) {
            if (confirm(msg))
                this.startGame()
            else
                this.gameIsRunning = false
        },
        doMonsterAttack: function() {
            this.doAttack(actions.MONSTER_ATTACK, consts.MIN_MONSTER_DMG, consts.MAX_MONSTER_DMG)
            this.checkEnd()
        },
        doAttackTurn: function(playerAction, min, max) {
            this.doAttack(playerAction, min, max)
            if (this.checkEnd()) return
            this.doMonsterAttack()
        },
        doAttack: function(action, min, max) {
            let damage = calcDamage(min, max)
            switch (action) {
                case actions.PLAYER_ATTACK:
                case actions.PLAYER_SP_ATTACK:
                    this.monsterHealth -= damage
                    break
                case actions.MONSTER_ATTACK:
                    this.playerHealth -= damage
                    break
                default:
                    break
            }
            this.addActionToLog(action, damage)
        },
        addActionToLog(type, value) {
            let logString = ''
            switch(type) {
                case actions.PLAYER_ATTACK:
                    logString = 'Player attacked the monster for ' + value + ' damage'
                    break
                case actions.PLAYER_SP_ATTACK:
                    logString = 'Player attacked the monster hard for ' + value + ' damage'
                    break
                case actions.MONSTER_ATTACK:
                    logString = 'Monster attacked the player for ' + value + ' damage'
                    break
                case actions.HEAL:
                    logString = 'Player healed itself for ' + value + ' health'
                    break
                default:
                    break
            }

            this.turns.unshift({
                isPlayer: (type == actions.PLAYER_ATTACK) || (type == actions.PLAYER_SP_ATTACK) || (type == actions.HEAL),
                text: logString
            })
        }
    }
})