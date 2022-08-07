/*
德州扑克 牌型示例
皇家同花顺 Royal flush: ['♦️A','♦️K','♦️Q','♦️J','♦️10'] 
同花顺 Straight flush: ['♣️8','♣️7','♣️6','♣️5','♣️4'] 
四条 Four of a kind: ['♠️J','♥️J','♣️J','♦️J','♣️6'] 
葫芦 Three of a kind with a pair:  ['♠️J','♥️J','♣️J','♣️6','♦️6'] 
同花 Flush: ['♠️2','♠️8','♠️9','♠️10','♠️J'] 
顺子 Straight: ['♥️8','♣️7','♦️6','♠️5','♠️4']
三条 Three of a kind: ['♠️J','♥️J','♣️J','♣️6','♦️5']
两对 Two pair: ['♠️J','♥️J','♣️6','♣️6','♦️5']
一对 One pair: ['♠️J','♥️J','♣️7','♣️6','♦️5']
散牌 High Card: ['♦️3','♣️J','♠️8','♥️5','♠️2']
*/

const colors = ['♠️','♥️','♣️','♦️']  // 四种花色
const values = [2,3,4,5,6,7,8,9,10,'J','Q','K','A']  // 13种牌值
const Map = {  // 定义映射表
  A: 14,
  K: 13,
  Q: 12,
  J: 11,
  10: "皇家同花顺",
  9: "同花顺",
  8: "四条",
  7: "葫芦",
  6: "同花",
  5: "顺子",
  4: "三条",
  3: "两对",
  2: "一对",
  1: "散牌",
}
const cards = []
function generate52Cards(){
  for(let i = 0; i < colors.length; i++){
    for(let j = 0; j < values.length; j++){
      const card  = {}
      card.color  = colors[i]
      card.value  = values[j]
      card.number = Number(values[j]) || Map[values[j]] 
      cards.push(card)
    }
  }
  return cards
}
generate52Cards() // 生成52张牌

function get5Cards(){  // 随机取5张牌
  const temp =[]
  for(let i=0; i<5; i++){
    const randomIndex = Math.floor(Math.random()*cards.length)
    const randomValue = cards.splice(randomIndex,1)
    temp.push(...randomValue)
  }
  return temp
}

const player   = get5Cards() // 生成玩家手牌
const computer = get5Cards() // 生成电脑手牌

function isSameColor(cards){   // 判断是否是同花
  return cards.every(card=>card.color==cards[0].color)
}

function calCardsInfo(cards){  //
  const numbers = cards.map(card=>card.number)  // 用一个数组来保存手牌的数字
  const counter = {}  // 用一个对象来保存每个数字出现的次数作为计数器
  numbers.forEach(number=>counter[number]? counter[number]++ : counter[number]=1) // {} => {3:2,10:1,11:2}
  const rounds = Object.values(counter).sort((a,b)=>b-a).toString()  // {3:2,10:1,11:2} => [2,1,2] => [2,2,1] => '2,2,1' 定义回合，便于后面比较。
  /*
  注意：由于牌型示例没有考虑到特殊情况，譬如：
  const player1 = ['♠️J','♣️J','♣️8','♦️8','♠️8']
  const computer1 = ['♠️10','♥️10','♣️9','♦️9','♠️9']
  const player2 = ['♠️J','♥️8','♣️8','♦️7','♣️6']
  const computer2 = ['♠️10','♥️9','♣️9','♦️6','♣️5']
  所以扑克牌不能简单按照牌值的大小来排序，必须优先考虑牌型。
  排序部分是整个游戏中最难的部分，对逻辑的缜密性和思维的抽象程度要求极高。
  */
  cards.sort((a,b)=>{  // sort 操作会修改原数组
    if(counter[a.number] == counter[b.number]){ 
      return b.number-a.number // 如果数字出现的次数相同，按照数字本身的值从大到小排列。
    }else{           
      return counter[b.number]-counter[a.number]  // 反之，按照数字出现的次数从大到小排列。
    }
  }) // ['♥️3','♦️3','♠️10','♣️J','♥️J'] => ['♣️J','♥️J','♥️3','♦️3','♠️10']
  console.log(cards)
  return {
    isSameColor: isSameColor(cards),
    rounds: rounds,
    cards: cards
  }  // 返回牌的信息：同花、回合和手牌。
}
const playerInfo   = calCardsInfo(player)   // 计算出玩家手牌的信息
const computerInfo = calCardsInfo(computer) // 计算出电脑手牌的信息

function calCardRank(info){  // 计算出手牌对应的牌型
  const { isSameColor, cards, rounds } = info
  if(isSameColor){     // 如果是相同花色，证明是同花，继续判断
    if(cards[0].number - cards[4].number == 4){  // 如果最大数减去最小数等于4，证明是同花顺
      if(cards[0].number == 14){        // 如果最大数为14，证明是皇家同花顺
        return 10 // 皇家同花顺
      }else{
        return 9 // 同花顺
      } 
    }else{
      return 6 // 同花
    }
  }else{  // 如果不是相同花色，证明不是同花，继续判断
    if(rounds=='2,1,1,1'){
      return 2 // 一对
    }
    if(rounds=='2,2,1'){
      return 3 // 两对
    }
    if(rounds=='3,1,1'){
      return 4 // 三条
    }
    if(rounds=='3,2'){
      return 7 // 葫芦
    }
    if(rounds=='4,1'){
      return 8 // 四条
    }
    if(rounds=='1,1,1,1,1'){
      if(cards[0].number - cards[4].number == 4){   // 如果最大数减去最小数等于4，证明是顺子
        return 5 // 顺子
      }else{
        return 1 // 散牌
      }
    }
  }
}

function compareCardSize(player,computer){
  console.log("玩家的牌型是 " + Map[calCardRank(player)])
  console.log("电脑的牌型是 " + Map[calCardRank(computer)])
  if(calCardRank(player)>calCardRank(computer)){
    return console.log('玩家赢了')
  }else if(calCardRank(player)<calCardRank(computer)){
    return console.log('玩家输了')
  }else{
    console.log('玩家和电脑的牌型相同')
    console.log('现在进入最终对决......')
    setTimeout(function(){
      for(let i=0;i<computer.cards.length;i++){
				console.log(`第${i+1}轮PK`)
				console.log('玩家的手牌为'+ player.cards[i].color+" "+player.cards[i].value)
				console.log('电脑的手牌为'+ computer.cards[i].color+" "+computer.cards[i].value)
        if(player.cards[i].number > computer.cards[i].number){
          return console.log('玩家赢了')
        }else if(player.cards[i].number < computer.cards[i].number){
          return console.log('玩家输了')
        }else{
          console.log('玩家和电脑的手牌大小相同')
        }
      }
      console.log(`经过${i+1}轮鏖战，玩家和电脑打成平局`)
    },1000)
  }
}
// 由于命令行中花色与牌值重叠，所以在中间加空格分开。
console.log("玩家的手牌是 " + player.map(item=>item.color+" "+item.value).join(" "))
console.log("电脑的手牌是 " + computer.map(item=>item.color+" "+item.value).join(" "))
compareCardSize(playerInfo,computerInfo)
