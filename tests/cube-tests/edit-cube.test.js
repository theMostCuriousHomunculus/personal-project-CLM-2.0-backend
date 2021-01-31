import mongoose from 'mongoose';
import request from 'supertest';

import Cube from '../../models/cube-model.js';
import server from '../../server.js';
import {
  existingCube1,
  existingUser1,
  setupDatabase
} from '../fixtures/test-db-setup.js';
import {
  conclaveMentor,
  conclaveMentorChanges,
  lightningBolt,
  lightningBoltChanges,
  nicolBolasPlaneswalker,
  nicolBolasPlaneswalkerChanges
} from '../fixtures/card-data.js';

await setupDatabase();

test('edit-cube', async function () {
  // ensures the correctly authenticated user can add a card to the mainboard of a cube
  const response1 = await request(server)
    .patch(`/api/cube/${existingCube1._id}`)
    .set('Authorization', `Bearer ${existingUser1.tokens[0].token}`)
    .send({
      action: 'add_card',
      component: 'mainboard',
      ...lightningBolt
    })
    .expect(201);

  expect(response1.body)
    .toEqual({
      _id: expect.anything()
    });

  // ensures the correctly authenticated user can add a card to the sideboard of a cube
  const response2 = await request(server)
    .patch(`/api/cube/${existingCube1._id}`)
    .set('Authorization', `Bearer ${existingUser1.tokens[0].token}`)
    .send({
      action: 'add_card',
      component: 'sideboard',
      ...nicolBolasPlaneswalker
    })
    .expect(201);

  expect(response2.body)
    .toEqual({
      _id: expect.anything()
    });

  let modifiedCube = await Cube.findById(existingCube1._id);
  modifiedCube = modifiedCube.toJSON();

  expect(modifiedCube.mainboard)
    .toContainEqual({
      _id: mongoose.Types.ObjectId(response1.body._id),
      ...lightningBolt
    });

  expect(modifiedCube.sideboard)
    .toContainEqual({
      _id: mongoose.Types.ObjectId(response2.body._id),
      ...nicolBolasPlaneswalker
    });

  // ensures the properly authenticated user can edit a card in the mainboard of a cube
  await request(server)
    .patch(`/api/cube/${existingCube1._id}`)
    .set('Authorization', `Bearer ${existingUser1.tokens[0].token}`)
    .send({
      action: 'edit_card',
      component: 'mainboard',
      cardId: response1.body._id,
      ...lightningBoltChanges
    })
    .expect(204);

  // ensures the properly authenticated user can edit a card in the sideboard of a cube
  await request(server)
    .patch(`/api/cube/${existingCube1._id}`)
    .set('Authorization', `Bearer ${existingUser1.tokens[0].token}`)
    .send({
      action: 'edit_card',
      component: 'sideboard',
      cardId: response2.body._id,
      ...nicolBolasPlaneswalkerChanges
    })
    .expect(204);

  modifiedCube = await Cube.findById(existingCube1._id);
  modifiedCube = modifiedCube.toJSON();

  expect(modifiedCube.mainboard)
    .toContainEqual({
      _id: mongoose.Types.ObjectId(response1.body._id),
      ...lightningBolt,
      ...lightningBoltChanges
    });
  
  expect(modifiedCube.sideboard)
    .toContainEqual({
      _id: mongoose.Types.ObjectId(response2.body._id),
      ...nicolBolasPlaneswalker,
      ...nicolBolasPlaneswalkerChanges
    });

  // ensures the properly authenticated user can move and delete cards to and from the cube's mainboard and sideboard
  await request(server)
    .patch(`/api/cube/${existingCube1._id}`)
    .set('Authorization', `Bearer ${existingUser1.tokens[0].token}`)
    .send({
      action: 'move_or_delete_card',
      component: 'mainboard',
      cardId: response1.body._id,
      destination: 'sideboard'
    })
    .expect(204);

  await request(server)
    .patch(`/api/cube/${existingCube1._id}`)
    .set('Authorization', `Bearer ${existingUser1.tokens[0].token}`)
    .send({
      action: 'move_or_delete_card',
      component: 'sideboard',
      cardId: response2.body._id,
      destination: 'mainboard'
    })
    .expect(204);

  modifiedCube = await Cube.findById(existingCube1._id);
  modifiedCube = modifiedCube.toJSON();

  expect(modifiedCube.mainboard)
    .toContainEqual({
      _id: mongoose.Types.ObjectId(response2.body._id),
      ...nicolBolasPlaneswalker,
      ...nicolBolasPlaneswalkerChanges
    });

  expect(modifiedCube.mainboard)
    .not
    .toContainEqual({
      _id: mongoose.Types.ObjectId(response1.body._id),
      ...lightningBolt,
      ...lightningBoltChanges
    });

  expect(modifiedCube.sideboard)
    .toContainEqual({
      _id: mongoose.Types.ObjectId(response1.body._id),
      ...lightningBolt,
      ...lightningBoltChanges
    });

  expect(modifiedCube.sideboard)
    .not
    .toContainEqual({
      _id: mongoose.Types.ObjectId(response2.body._id),
      ...nicolBolasPlaneswalker,
      ...nicolBolasPlaneswalkerChanges
    });

  await request(server)
    .patch(`/api/cube/${existingCube1._id}`)
    .set('Authorization', `Bearer ${existingUser1.tokens[0].token}`)
    .send({
      action: 'move_or_delete_card',
      component: 'mainboard',
      cardId: response2.body._id
    })
    .expect(204);

  await request(server)
    .patch(`/api/cube/${existingCube1._id}`)
    .set('Authorization', `Bearer ${existingUser1.tokens[0].token}`)
    .send({
      action: 'move_or_delete_card',
      component: 'sideboard',
      cardId: response1.body._id
    })
    .expect(204);

  modifiedCube = await Cube.findById(existingCube1._id);
  modifiedCube = modifiedCube.toJSON();

  expect(modifiedCube.mainboard)
    .not
    .toContainEqual({
      _id: mongoose.Types.ObjectId(response2.body._id),
      ...nicolBolasPlaneswalker,
      ...nicolBolasPlaneswalkerChanges
    });

  expect(modifiedCube.sideboard)
    .not
    .toContainEqual({
      _id: mongoose.Types.ObjectId(response1.body._id),
      ...lightningBolt,
      ...lightningBoltChanges
    });

  // ensures the properly authenticated user can add modules and rotations to a cube
  const response3 = await request(server)
    .patch(`/api/cube/${existingCube1._id}`)
    .set('Authorization', `Bearer ${existingUser1.tokens[0].token}`)
    .send({
      action: 'add_module',
      name: 'New Module'
    })
    .expect(201);

  expect(response3.body)
    .toEqual({
      _id: expect.any(String)
    })

  const response4 = await request(server)
    .patch(`/api/cube/${existingCube1._id}`)
    .set('Authorization', `Bearer ${existingUser1.tokens[0].token}`)
    .send({
      action: 'add_rotation',
      name: 'New Rotation'
    })
    .expect(201);

  expect(response4.body)
    .toEqual({
      _id: expect.any(String)
    });

  modifiedCube = await Cube.findById(existingCube1);
  modifiedCube = modifiedCube.toJSON();

  expect(modifiedCube.modules.find(module => module._id.toString() === response3.body._id))
    .toEqual({
      _id: mongoose.Types.ObjectId(response3.body._id),
      cards: [],
      name: 'New Module'
    });

  expect(modifiedCube.rotations.find(rotation => rotation._id.toString() === response4.body._id))
    .toEqual({
      _id: mongoose.Types.ObjectId(response4.body._id),
      cards: [],
      name: 'New Rotation',
      size: 0
    });

  // ensures the properly authenticated user can edit the modules and rotations of a cube
  await request(server)
    .patch(`/api/cube/${existingCube1._id}`)
    .set('Authorization', `Bearer ${existingUser1.tokens[0].token}`)
    .send({
      action: 'edit_module',
      component: response3.body._id,
      name: 'Changed Module Name'
    })
    .expect(204);

  await request(server)
    .patch(`/api/cube/${existingCube1._id}`)
    .set('Authorization', `Bearer ${existingUser1.tokens[0].token}`)
    .send({
      action: 'edit_rotation',
      component: response4.body._id,
      name: 'Changed Rotation Name',
      size: 1
    })
    .expect(204);

  modifiedCube = await Cube.findById(existingCube1);
  modifiedCube = modifiedCube.toJSON();

  expect(modifiedCube.modules.find(module => module._id.toString() === response3.body._id))
    .toEqual({
      _id: mongoose.Types.ObjectId(response3.body._id),
      cards: [],
      name: 'Changed Module Name'
    });

  expect(modifiedCube.rotations.find(rotation => rotation._id.toString() === response4.body._id))
    .toEqual({
      _id: mongoose.Types.ObjectId(response4.body._id),
      cards: [],
      name: 'Changed Rotation Name',
      size: 1
    });

  // ensures the properly authenticated user can add, edit and remove cards to and from modules and rotations
  const response5 = await request(server)
    .patch(`/api/cube/${existingCube1._id}`)
    .set('Authorization', `Bearer ${existingUser1.tokens[0].token}`)
    .send({
      action: 'add_card',
      component: response3.body._id,
      ...conclaveMentor
    })
    .expect(201);

  expect(response5.body)
    .toEqual({
      _id: expect.anything()
    });

  const response6 = await request(server)
    .patch(`/api/cube/${existingCube1._id}`)
    .set('Authorization', `Bearer ${existingUser1.tokens[0].token}`)
    .send({
      action: 'add_card',
      component: response4.body._id,
      ...conclaveMentor
    })
    .expect(201);

  expect(response6.body)
    .toEqual({
      _id: expect.anything()
    });

  modifiedCube = await Cube.findById(existingCube1._id);
  modifiedCube = modifiedCube.toJSON();
  
  expect(modifiedCube.modules.find(module => module._id.toString() === response3.body._id).cards)
    .toContainEqual({
      _id: mongoose.Types.ObjectId(response5.body._id),
      ...conclaveMentor
    });
  
  expect(modifiedCube.rotations.find(rotation => rotation._id.toString() === response4.body._id).cards)
    .toContainEqual({
      _id: mongoose.Types.ObjectId(response6.body._id),
      ...conclaveMentor
    });

  await request(server)
    .patch(`/api/cube/${existingCube1._id}`)
    .set('Authorization', `Bearer ${existingUser1.tokens[0].token}`)
    .send({
      action: 'edit_card',
      component: response3.body._id,
      cardId: response5.body._id,
      ...conclaveMentorChanges
    })
    .expect(204);

  await request(server)
    .patch(`/api/cube/${existingCube1._id}`)
    .set('Authorization', `Bearer ${existingUser1.tokens[0].token}`)
    .send({
      action: 'edit_card',
      component: response4.body._id,
      cardId: response6.body._id,
      ...conclaveMentorChanges
    })
    .expect(204);

  modifiedCube = await Cube.findById(existingCube1._id);
  modifiedCube = modifiedCube.toJSON();
  
  expect(modifiedCube.modules.find(module => module._id.toString() === response3.body._id).cards)
    .toContainEqual({
      _id: mongoose.Types.ObjectId(response5.body._id),
      ...conclaveMentor,
      ...conclaveMentorChanges
    });
  
  expect(modifiedCube.rotations.find(rotation => rotation._id.toString() === response4.body._id).cards)
    .toContainEqual({
      _id: mongoose.Types.ObjectId(response6.body._id),
      ...conclaveMentor,
      ...conclaveMentorChanges
    });

  await request(server)
    .patch(`/api/cube/${existingCube1._id}`)
    .set('Authorization', `Bearer ${existingUser1.tokens[0].token}`)
    .send({
      action: 'move_or_delete_card',
      component: response3.body._id,
      cardId: response5.body._id,
      destination: response4.body._id
    })
    .expect(204);

  await request(server)
    .patch(`/api/cube/${existingCube1._id}`)
    .set('Authorization', `Bearer ${existingUser1.tokens[0].token}`)
    .send({
      action: 'move_or_delete_card',
      component: response4.body._id,
      cardId: response6.body._id,
      destination: response3.body._id
    })
    .expect(204);

  modifiedCube = await Cube.findById(existingCube1._id);
  modifiedCube = modifiedCube.toJSON();
  
  expect(modifiedCube.modules.find(module => module._id.toString() === response3.body._id).cards)
    .not
    .toContainEqual({
      _id: mongoose.Types.ObjectId(response5.body._id),
      ...conclaveMentor,
      ...conclaveMentorChanges
    });

  expect(modifiedCube.modules.find(module => module._id.toString() === response3.body._id).cards)
    .toContainEqual({
      _id: mongoose.Types.ObjectId(response6.body._id),
      ...conclaveMentor,
      ...conclaveMentorChanges
    });
  
  expect(modifiedCube.rotations.find(rotation => rotation._id.toString() === response4.body._id).cards)
    .not
    .toContainEqual({
      _id: mongoose.Types.ObjectId(response6.body._id),
      ...conclaveMentor,
      ...conclaveMentorChanges
    });

  expect(modifiedCube.rotations.find(rotation => rotation._id.toString() === response4.body._id).cards)
    .toContainEqual({
      _id: mongoose.Types.ObjectId(response5.body._id),
      ...conclaveMentor,
      ...conclaveMentorChanges
    });

  await request(server)
    .patch(`/api/cube/${existingCube1._id}`)
    .set('Authorization', `Bearer ${existingUser1.tokens[0].token}`)
    .send({
      action: 'move_or_delete_card',
      component: response3.body._id,
      cardId: response6.body._id
    })
    .expect(204);

  await request(server)
    .patch(`/api/cube/${existingCube1._id}`)
    .set('Authorization', `Bearer ${existingUser1.tokens[0].token}`)
    .send({
      action: 'move_or_delete_card',
      component: response4.body._id,
      cardId: response5.body._id
    })
    .expect(204);

  modifiedCube = await Cube.findById(existingCube1._id);
  modifiedCube = modifiedCube.toJSON();
  
  expect(modifiedCube.modules.find(module => module._id.toString() === response3.body._id).cards)
    .not
    .toContainEqual({
      _id: mongoose.Types.ObjectId(response6.body._id),
      ...conclaveMentor,
      ...conclaveMentorChanges
    });
  
  expect(modifiedCube.rotations.find(rotation => rotation._id.toString() === response4.body._id).cards)
    .not
    .toContainEqual({
      _id: mongoose.Types.ObjectId(response5.body._id),
      ...conclaveMentor,
      ...conclaveMentorChanges
    });

  // ensures the properly authenticated user can delete modules and rotations
  await request(server)
    .patch(`/api/cube/${existingCube1._id}`)
    .set('Authorization', `Bearer ${existingUser1.tokens[0].token}`)
    .send({
      action: 'delete_module',
      component: response3.body._id
    })
    .expect(204);

  await request(server)
    .patch(`/api/cube/${existingCube1._id}`)
    .set('Authorization', `Bearer ${existingUser1.tokens[0].token}`)
    .send({
      action: 'delete_rotation',
      component: response4.body._id
    })
    .expect(204);

  modifiedCube = await Cube.findById(existingCube1._id);
  modifiedCube = modifiedCube.toJSON();
  
  expect(modifiedCube.modules)
    .not
    .toContainEqual({
      _id: mongoose.Types.ObjectId(response3.body._id),
      cards: [],
      name: 'Changed Module Name'
    });
  
  expect(modifiedCube.rotations)
    .not
    .toContainEqual({
      _id: mongoose.Types.ObjectId(response4.body._id),
      cards: [],
      name: 'Changed Rotation Name'
    });

  // ensures the properly authenticated user can successfully edit the cube's info
  await request(server)
    .patch(`/api/cube/${existingCube1._id}`)
    .set('Authorization', `Bearer ${existingUser1.tokens[0].token}`)
    .send({
      action: 'edit_cube_info',
      description: 'So many balls all in one sac!',
      name: 'A sac of balls'
    })
    .expect(204);

  modifiedCube = await Cube.findById(existingCube1._id);
  modifiedCube = modifiedCube.toJSON();
  
  expect(modifiedCube)
    .toMatchObject({
      ...existingCube1,
      description: 'So many balls all in one sac!',
      name: 'A sac of balls'
    });
});