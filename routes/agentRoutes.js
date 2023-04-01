// agentRoutes.js
const express = require('express');
const router = express.Router();

const NFTRequest = require('../models/NFTRequest');
const Agent = require('../models/Agent');


router.post('/agents', async (req, res) => {
    try {
      // Create a new agent using the Agent model and req.body data
      const agent = new Agent({
        name: req.body.name,
        email: req.body.email,

      });
      // Save the agent to the database
      await agent.save();
      // Send the newly created agent back to the client
      res.json(agent);
    } catch (error) {
      // Handle errors and send an appropriate error response
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  
  module.exports = router;
// Endpoint for updating an agent's status
router.patch('/agents/:id', async (req, res) => {
  try {
    const agent = await Agent.findById(req.params.id);
    if (!agent) {
      return res.status(404).json({ error: 'Agent not found' });
    }
    agent.status = req.body.status;
    await agent.save();
    res.status(200).json({ message: 'Agent status updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error',err });
  }
});


// GET /nftRequests/:agent_id// This main route for getting assigned requests
router.get('/nftRequests/:agent_id', async (req, res) => {
    try {
      const agentId = req.params.agent_id;
      // Find all NFTRequest documents with matching assignedAgent field
      const nftRequests = await NFTRequest.find({ assignedAgent: agentId });
      // Send the matching NFTRequest documents back to the client
      res.json(nftRequests);
    } catch (error) {
      // Handle errors and send an appropriate error response
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });

  
// Endpoint for updating an NFT request's status
router.patch('/nft-requests/:id', async (req, res) => {
  try {
    const nftRequest = await NFTRequest.findById(req.params.id).populate('assignedAgent');
    if (!nftRequest) {
      return res.status(404).json({ error: 'NFT request not found' });
    }
    if (req.body.status !== 'accepted' && req.body.status !== 'rejected') {
      return res.status(400).json({ error: 'Invalid status value. Must be "accepted" or "rejected".' });
    }
    nftRequest.status = req.body.status;
    await nftRequest.save();

    // Update the agent status to 'available'
    nftRequest.assignedAgent.status = 'available';
    await nftRequest.assignedAgent.save();

    res.status(200).json({ message: `NFT request ${nftRequest._id} updated successfully` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error',err });

    }});

    module.exports = router;


