import axios from 'axios';

export default async function (card) {
  let art_crop, back_image, image, mana_cost, type_line;
  switch (card.layout) {
    case 'adventure':
      // this mechanic debuted in Throne of Eldrain.  all adventure cards are either (instants or sorceries) and creatures.  it seems to have been popular, so it may appear again
      art_crop = card.image_uris.art_crop;
      image = card.image_uris.large;
      mana_cost = `${card.card_faces[0].mana_cost}${card.card_faces[1].mana_cost}`;
      type_line = `${card.card_faces[0].type_line} / ${card.card_faces[1].type_line}`;
      break;
    case 'flip':
      // flip was only in Kamigawa block (plus an "Un" card and a couple of reprints), which was before planeswalkers existed.  unlikely they ever bring this layout back, and if they do, no idea how they would fit a planeswalker onto one side.  all flip cards are creatures on one end and either a creature or an enchantment on the other
      art_crop = card.image_uris.art_crop;
      image = card.image_uris.large;
      mana_cost = card.card_faces[0].mana_cost;
      type_line = `${card.card_faces[0].type_line} / ${card.card_faces[1].type_line}`;
      break;
    case 'leveler':
      // all level up cards have been creatures.  this is a mechanic that has so far only appeared in Rise of the Eldrazi and a single card in Modern Horizons.  i don't expect the mechanic to return, but the printing of Hexdrinker in MH1 suggests it may
      art_crop = card.image_uris.art_crop;
      image = card.image_uris.large;
      mana_cost = card.mana_cost;
      type_line = card.type_line;
      break;
    case 'meld':
      // meld only appeared in Eldritch Moon and probably won't ever come back.  no planeswalkers; only creatures and a single land
      art_crop = card.image_uris.art_crop;
      mana_cost = card.mana_cost;
      type_line = card.type_line;
      const meldResultPart = card.all_parts.find(part => part.component === 'meld_result');
      const meldResult = await axios.get(meldResultPart.uri);
      back_image = meldResult.data.image_uris.normal;
      image = card.image_uris.normal;
      break;
      case 'modal_dfc':
        art_crop = card.card_faces[0].image_uris.art_crop;
        back_image = card.card_faces[1].image_uris.large;
        image = card.card_faces[0].image_uris.large;
        mana_cost = `${card.card_faces[0].mana_cost}${card.card_faces[1].mana_cost}`;
        type_line = `${card.card_faces[0].type_line} / ${card.card_faces[1].type_line}`;
        break;
      case 'saga':
        // saga's have no other faces; they simply have their own layout type becuase of the fact that the art is on the right side of the card rather than the top of the card.  all sagas printed so far (through Kaldheim) have only 3 or 4 chapters
        art_crop = card.image_uris.art_crop;
        image = card.image_uris.large;
        mana_cost = card.mana_cost;
        type_line = card.type_line;
        break;
      case 'split':
        // split cards are always instants and/or sorceries
        art_crop = card.image_uris.art_crop;
        image = card.image_uris.large;
        mana_cost = `${card.card_faces[0].mana_cost}${card.card_faces[1].mana_cost}`;
        type_line = `${card.card_faces[0].type_line} / ${card.card_faces[1].type_line}`;
        break;
      case 'transform':
        art_crop = card.card_faces[0].image_uris.art_crop;
        back_image = card.card_faces[1].image_uris.large;
        image = card.card_faces[0].image_uris.large;
        mana_cost = card.card_faces[0].mana_cost;
        type_line = `${card.card_faces[0].type_line} / ${card.card_faces[1].type_line}`;
        break;
      default:
        art_crop = card.image_uris.art_crop;
        image = card.image_uris.large;
        mana_cost = card.mana_cost;
        type_line = card.type_line;
  }

  return {
    art_crop,
    back_image,
    cmc: card.cmc,
    collector_number: card.collector_number,
    color_identity: card.color_identity,
    image,
    keywords: card.keywords,
    mana_cost,
    mtgo_id: card.mtgo_id,
    name: card.name,
    oracle_id: card.oracle_id,
    scryfall_id: card.id,
    set: card.set,
    set_name: card.set_name,
    tcgplayer_id: card.tcgplayer_id,
    tokens: card.all_parts ?
      card.all_parts.filter(part => part.component === 'token').map(part => ({ name: part.name, scryfall_id: part.id })) :
      [],
    type_line
  };
}