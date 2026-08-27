const HotelConfig = require('../../models/hotelConfig');
const { record } = require('./audit');

/**
 * Get current hotel configuration
 */
async function getConfig(req, res) {
    const config = await HotelConfig.getConfig();
    res.json(config);
}

/**
 * Update hotel configuration (full or partial)
 */
async function updateConfig(req, res) {
    const updates = req.body;
    const userId = req.user?.name || 'Unknown';

    const config = await HotelConfig.updateConfig(updates, userId);

    // Log the configuration change
    await record({
        req,
        action: 'update',
        entity: 'hotel_config',
        entityId: config._id,
        details: `Configuration updated by ${userId}`
    });

    res.json(config);
}

/**
 * Update a specific section of configuration
 */
async function updateSection(req, res) {
    const { section } = req.params;
    const updates = req.body;
    const userId = req.user?.name || 'Unknown';

    const config = await HotelConfig.getConfig();
    
    if (!config[section]) {
        return res.status(400).json({ error: `Invalid section: ${section}` });
    }

    config[section] = { ...config[section], ...updates };
    config.lastUpdatedBy = userId;
    await config.save();

    await record({
        req,
        action: 'update',
        entity: 'hotel_config',
        entityId: config._id,
        details: `${section} section updated by ${userId}`
    });

    res.json(config);
}

/**
 * Add item to knowledge base (restaurant, attraction, FAQ, policy)
 */
async function addKnowledgeItem(req, res) {
    const { type } = req.params; // restaurants, attractions, faqs, policies
    const item = req.body;
    const userId = req.user?.name || 'Unknown';

    const config = await HotelConfig.getConfig();

    if (!config.knowledgeBase[type]) {
        return res.status(400).json({ error: `Invalid knowledge base type: ${type}` });
    }

    config.knowledgeBase[type].push(item);
    config.lastUpdatedBy = userId;
    await config.save();

    await record({
        req,
        action: 'create',
        entity: 'knowledge_base',
        details: `Added ${type} item: ${item.name || item.question || item.title}`
    });

    res.json(config.knowledgeBase[type]);
}

/**
 * Update item in knowledge base
 */
async function updateKnowledgeItem(req, res) {
    const { type, index } = req.params;
    const updates = req.body;
    const userId = req.user?.name || 'Unknown';

    const config = await HotelConfig.getConfig();

    if (!config.knowledgeBase[type] || !config.knowledgeBase[type][index]) {
        return res.status(404).json({ error: 'Knowledge base item not found' });
    }

    config.knowledgeBase[type][index] = { ...config.knowledgeBase[type][index], ...updates };
    config.lastUpdatedBy = userId;
    await config.save();

    await record({
        req,
        action: 'update',
        entity: 'knowledge_base',
        details: `Updated ${type} item at index ${index}`
    });

    res.json(config.knowledgeBase[type][index]);
}

/**
 * Delete item from knowledge base
 */
async function deleteKnowledgeItem(req, res) {
    const { type, index } = req.params;
    const userId = req.user?.name || 'Unknown';

    const config = await HotelConfig.getConfig();

    if (!config.knowledgeBase[type] || !config.knowledgeBase[type][index]) {
        return res.status(404).json({ error: 'Knowledge base item not found' });
    }

    const deleted = config.knowledgeBase[type].splice(index, 1)[0];
    config.lastUpdatedBy = userId;
    await config.save();

    await record({
        req,
        action: 'delete',
        entity: 'knowledge_base',
        details: `Deleted ${type} item: ${deleted.name || deleted.question || deleted.title}`
    });

    res.json({ message: 'Item deleted', deleted });
}

/**
 * Reset configuration to defaults
 */
async function resetConfig(req, res) {
    const userId = req.user?.name || 'Unknown';

    const config = await HotelConfig.getConfig();
    
    // Delete and recreate with defaults
    await HotelConfig.deleteOne({ _id: config._id });
    const newConfig = await HotelConfig.create({ lastUpdatedBy: userId });

    await record({
        req,
        action: 'delete',
        entity: 'hotel_config',
        entityId: config._id,
        details: `Configuration reset to defaults by ${userId}`
    });

    res.json(newConfig);
}

/**
 * Get AI training suggestions based on conversation history
 */
async function getTrainingSuggestions(req, res) {
    const AiConversation = require('../../models/aiConversation');
    
    // Find common questions that don't have FAQ entries
    const conversations = await AiConversation.find({ verified: true })
        .sort({ createdAt: -1 })
        .limit(100)
        .select('messages metadata');

    // Extract guest questions
    const guestQuestions = [];
    conversations.forEach(conv => {
        conv.messages.forEach(msg => {
            if (msg.role === 'guest' && msg.content.includes('?')) {
                guestQuestions.push({
                    question: msg.content,
                    intent: conv.metadata?.intent,
                    timestamp: msg.timestamp
                });
            }
        });
    });

    // Group similar questions (simple approach - can be enhanced)
    const questionFrequency = {};
    guestQuestions.forEach(q => {
        const normalized = q.question.toLowerCase().trim();
        if (!questionFrequency[normalized]) {
            questionFrequency[normalized] = { count: 0, intent: q.intent, example: q.question };
        }
        questionFrequency[normalized].count++;
    });

    // Sort by frequency
    const suggestions = Object.values(questionFrequency)
        .filter(q => q.count >= 2) // Only suggest if asked at least twice
        .sort((a, b) => b.count - a.count)
        .slice(0, 20)
        .map(q => ({
            question: q.example,
            frequency: q.count,
            intent: q.intent,
            suggestedAnswer: 'Add answer here...'
        }));

    res.json({
        totalConversations: conversations.length,
        totalQuestions: guestQuestions.length,
        suggestions
    });
}

module.exports = {
    getConfig,
    updateConfig,
    updateSection,
    addKnowledgeItem,
    updateKnowledgeItem,
    deleteKnowledgeItem,
    resetConfig,
    getTrainingSuggestions
};
