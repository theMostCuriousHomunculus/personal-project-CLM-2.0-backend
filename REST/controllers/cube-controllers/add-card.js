import returnComponent from '../../../utils/return-component.js';
import validCardProperties from '../../../constants/valid-card-properties.js';

export default async function (req, res) {
  try {
    const component = await returnComponent(req.cube, req.params.componentId);
    const card = {};
    
    for (let property of validCardProperties) {
      if (typeof req.body[property.name] !== 'undefined') {
        if (property.specialNumeric && isNaN(req.body[property.name])){
          card[property.name] = 0;
        } else {
          card[property.name] = req.body[property.name];
        }
      }
    }

    component.push(card);
    await req.cube.save();
    res.status(201).json({ _id: component[component.length - 1]._id });

  } catch (error) {
    console.log(error.message);
    res.status(error.code || 500).json({ message: error.message });
  }
}