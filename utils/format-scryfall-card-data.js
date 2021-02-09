import axios from 'axios';

export default async function (card) {
  let back_image, chapters, image, loyalty, mana_cost, power, toughness, type_line;

  switch(card.layout) {
    case 'split':
      // split cards are always instants and/or sorceries
      mana_cost = `${card.card_faces[0].mana_cost}${card.card_faces[1].mana_cost}`;
      type_line = `${card.card_faces[0].type_line} / ${card.card_faces[1].type_line}`;
      break;
    case 'flip':
      // flip was only in Kamigawa block (plus an "Un" card and a couple of reprints), which was before planeswalkers existed.  unlikely they ever bring this layout back, and if they do, no idea how they would fit a planeswalker onto one side.  all flip cards are creatures on one end and either a creature or an enchantment on the other
      mana_cost = card.card_faces[0].mana_cost;
      if (card.card_faces[0].power) {
        power = card.card_faces[0].power;
      } else if (card.card_faces[1].power) {
        power = card.card_faces[1].power;
      }
      if (card.card_faces[0].toughness) {
        toughness = card.card_faces[0].toughness;
      } else if (card.card_faces[1].toughness) {
        toughness = card.card_faces[1].toughness;
      }
      type_line = `${card.card_faces[0].type_line} / ${card.card_faces[1].type_line}`;
      break;
    case 'transform':
      if (card.card_faces[0].loyalty) {
        loyalty = card.card_faces[0].loyalty;
      } else if (card.card_faces[1].loyalty) {
        // think baby jace
        loyalty = card.card_faces[1].loyalty;
      }
      mana_cost = card.card_faces[0].mana_cost;
      if (card.card_faces[0].power) {
        power = card.card_faces[0].power;
      } else if (card.card_faces[1].power) {
        // think elbrus, the binding blade
        power = card.card_faces[1].power;
      }
      if (card.card_faces[0].toughness) {
        toughness = card.card_faces[0].toughness;
      } else if (card.card_faces[1].toughness) {
        toughness = card.card_faces[1].toughness;
      }
      type_line = `${card.card_faces[0].type_line} / ${card.card_faces[1].type_line}`;
      break;
    case 'modal_dfc':
      if (card.card_faces[0].loyalty) {
        loyalty = card.card_faces[0].loyalty;
      } else if (card.card_faces[1].loyalty) {
        // think valki, god of lies
        loyalty = card.card_faces[1].loyalty;
      }
      mana_cost = `${card.card_faces[0].mana_cost}${card.card_faces[1].mana_cost}`;
      if (card.card_faces[0].power) {
        power = card.card_faces[0].power;
      } else if (card.card_faces[1].power) {
        power = card.card_faces[1].power;
      }
      if (card.card_faces[0].toughness) {
        toughness = card.card_faces[0].toughness;
      } else if (card.card_faces[1].toughness) {
        toughness = card.card_faces[1].toughness;
      }
      type_line = `${card.card_faces[0].type_line} / ${card.card_faces[1].type_line}`;
      break;
    case 'meld':
      // meld only appeared in Eldritch Moon and probably won't ever come back.  no planeswalkers; only creatures and a single land
      mana_cost = card.mana_cost;
      power = card.power;
      toughness = card.toughness;
      type_line = card.type_line;
      break;
    case 'leveler':
      // all level up cards have been creatures.  this is a mechanic that has so far only appeared in Rise of the Eldrazi and a single card in Modern Horizons.  i don't expect the mechanic to return, but the printing of Hexdrinker in MH1 suggests it may
      mana_cost = card.mana_cost;
      power = card.power;
      toughness = card.toughness;
      type_line = card.type_line;
      break;
    case 'saga':
      // saga's have no other faces; they simply have their own layout type becuase of the fact that the art is on the right side of the card rather than the top of the card.  all sagas printed so far (through Kaldheim) have only 3 or 4 chapters
      if (card.oracle_text.includes('Sacrifice after III')) {
        chapters = 3;
      }
      if (card.oracle_text.includes('Sacrifice after IV')) {
        chapters = 4;
      }
      mana_cost = card.mana_cost;
      type_line = card.type_line;
      break;
    case 'adventure':
      // this mechanic debuted in Throne of Eldrain.  all adventure cards are either (instants or sorceries) and creatures.  it seems to have been popular, so it may appear again
      mana_cost = `${card.card_faces[0].mana_cost}${card.card_faces[1].mana_cost}`;
      power = card.card_faces[0].power;
      toughness = card.card_faces[0].toughness;
      type_line = `${card.card_faces[0].type_line} / ${card.card_faces[1].type_line}`;
      break;
    default:
      // 'normal' layout
      loyalty = card.loyalty;
      mana_cost = card.mana_cost;
      power = card.power;
      toughness = card.toughness;
      type_line = card.type_line;
  }

  switch (card.layout) {
    // just using the front image for the art crop (used for blog images and profile avatars)
    case 'transform':
      back_image = card.card_faces[1].image_uris.large;
      image = card.card_faces[0].image_uris.large;
      break;
    case 'modal_dfc':
      back_image = card.card_faces[1].image_uris.large;
      image = card.card_faces[0].image_uris.large;
      break;
    case 'meld':
      const meldResultPart = card.all_parts.find(function (part) {
        return part.component === 'meld_result';
      });
      const meldResult = await axios.get(meldResultPart.uri);
      back_image = meldResult.data.image_uris.large;
      image = card.image_uris.large;
      break;
    default:
      // split, flip, leveler, saga, adventure and normal layout cards
      image = card.image_uris.large;
  }

  return {
    back_image,
    chapters,
    cmc: card.cmc,
    color_identity: card.color_identity,
    image,
    keywords: card.keywords,
    loyalty: loyalty && isNaN(loyalty) ? 0 : loyalty,
    mana_cost,
    mtgo_id: card.mtgo_id,
    name: card.name,
    oracle_id: card.oracle_id,
    power: power && isNaN(power) ? 0 : power,
    printing: `${card.set_name} - ${card.collector_number}`,
    purchase_link: card.purchase_uris.tcgplayer.split("&")[0],
    toughness: toughness && isNaN(toughness) ? 0 : toughness,
    type_line
  };
}