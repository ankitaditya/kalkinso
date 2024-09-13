const AWS = require('aws-sdk');

// Configure AWS SDK
AWS.config.update({
  region: 'ap-south-1', // Replace with your desired region
});

const codecommit = new AWS.CodeCommit();

// Utility function to handle API calls
const handleApiCall = async (apiCall, params) => {
  try {
    const data = await apiCall(params).promise();
    return data;
  } catch (err) {
    console.error(`Error during ${apiCall.name}:`, err.message);
    throw err;
  }
};

// All API functions

// 1. Associate Approval Rule Template With Repository
const associateApprovalRuleTemplateWithRepository = async (params) => {
  return handleApiCall(codecommit.associateApprovalRuleTemplateWithRepository, params);
};

// 2. Batch Associate Approval Rule Template With Repositories
const batchAssociateApprovalRuleTemplateWithRepositories = async (params) => {
  return handleApiCall(codecommit.batchAssociateApprovalRuleTemplateWithRepositories, params);
};

// 3. Batch Describe Merge Conflicts
const batchDescribeMergeConflicts = async (params) => {
  return handleApiCall(codecommit.batchDescribeMergeConflicts, params);
};

// 4. Batch Disassociate Approval Rule Template From Repositories
const batchDisassociateApprovalRuleTemplateFromRepositories = async (params) => {
  return handleApiCall(codecommit.batchDisassociateApprovalRuleTemplateFromRepositories, params);
};

// 5. Batch Get Commits
const batchGetCommits = async (params) => {
  return handleApiCall(codecommit.batchGetCommits, params);
};

// 6. Batch Get Repositories
const batchGetRepositories = async (params) => {
  return handleApiCall(codecommit.batchGetRepositories, params);
};

// 7. Create Approval Rule Template
const createApprovalRuleTemplate = async (params) => {
  return handleApiCall(codecommit.createApprovalRuleTemplate, params);
};

// 8. Create Branch
const createBranch = async (params) => {
  return handleApiCall(codecommit.createBranch, params);
};

// 9. Create Commit
const createCommit = async (params) => {
  return handleApiCall(codecommit.createCommit, params);
};

// 10. Create Pull Request Approval Rule
const createPullRequestApprovalRule = async (params) => {
  return handleApiCall(codecommit.createPullRequestApprovalRule, params);
};

// 11. Create Pull Request
const createPullRequest = async (params) => {
  return handleApiCall(codecommit.createPullRequest, params);
};

// 12. Create Repository
const createRepository = async (params) => {
  return handleApiCall(codecommit.createRepository, params);
};

// 13. Create Unreferenced Merge Commit
const createUnreferencedMergeCommit = async (params) => {
  return handleApiCall(codecommit.createUnreferencedMergeCommit, params);
};

// 14. Delete Approval Rule Template
const deleteApprovalRuleTemplate = async (params) => {
  return handleApiCall(codecommit.deleteApprovalRuleTemplate, params);
};

// 15. Delete Branch
const deleteBranch = async (params) => {
  return handleApiCall(codecommit.deleteBranch, params);
};

// 16. Delete Comment Content
const deleteCommentContent = async (params) => {
  return handleApiCall(codecommit.deleteCommentContent, params);
};

// 17. Delete File
const deleteFile = async (params) => {
  return handleApiCall(codecommit.deleteFile, params);
};

// 18. Delete Pull Request Approval Rule
const deletePullRequestApprovalRule = async (params) => {
  return handleApiCall(codecommit.deletePullRequestApprovalRule, params);
};

// 19. Delete Repository
const deleteRepository = async (params) => {
  return handleApiCall(codecommit.deleteRepository, params);
};

// 20. Describe Merge Conflicts
const describeMergeConflicts = async (params) => {
  return handleApiCall(codecommit.describeMergeConflicts, params);
};

// 21. Describe Pull Request Events
const describePullRequestEvents = async (params) => {
  return handleApiCall(codecommit.describePullRequestEvents, params);
};

// 22. Disassociate Approval Rule Template From Repository
const disassociateApprovalRuleTemplateFromRepository = async (params) => {
  return handleApiCall(codecommit.disassociateApprovalRuleTemplateFromRepository, params);
};

// 23. Evaluate Pull Request Approval Rules
const evaluatePullRequestApprovalRules = async (params) => {
  return handleApiCall(codecommit.evaluatePullRequestApprovalRules, params);
};

// 24. Get Approval Rule Template
const getApprovalRuleTemplate = async (params) => {
  return handleApiCall(codecommit.getApprovalRuleTemplate, params);
};

// 25. Get Blob
const getBlob = async (params) => {
  return handleApiCall(codecommit.getBlob, params);
};

// 26. Get Branch
const getBranch = async (params) => {
  return handleApiCall(codecommit.getBranch, params);
};

// 27. Get Comment
const getComment = async (params) => {
  return handleApiCall(codecommit.getComment, params);
};

// 28. Get Comment Reactions
const getCommentReactions = async (params) => {
  return handleApiCall(codecommit.getCommentReactions, params);
};

// 29. Get Comments For Compared Commit
const getCommentsForComparedCommit = async (params) => {
  return handleApiCall(codecommit.getCommentsForComparedCommit, params);
};

// 30. Get Comments For Pull Request
const getCommentsForPullRequest = async (params) => {
  return handleApiCall(codecommit.getCommentsForPullRequest, params);
};

// 31. Get Commit
const getCommit = async (params) => {
  return handleApiCall(codecommit.getCommit, params);
};

// 32. Get Differences
const getDifferences = async (params) => {
  return handleApiCall(codecommit.getDifferences, params);
};

// 33. Get File
const getFile = async (params) => {
  return handleApiCall(codecommit.getFile, params);
};

// 34. Get Folder
const getFolder = async (params) => {
  return handleApiCall(codecommit.getFolder, params);
};

// 35. Get Merge Commit
const getMergeCommit = async (params) => {
  return handleApiCall(codecommit.getMergeCommit, params);
};

// 36. Get Merge Conflicts
const getMergeConflicts = async (params) => {
  return handleApiCall(codecommit.getMergeConflicts, params);
};

// 37. Get Merge Options
const getMergeOptions = async (params) => {
  return handleApiCall(codecommit.getMergeOptions, params);
};

// 38. Get Pull Request Approval States
const getPullRequestApprovalStates = async (params) => {
  return handleApiCall(codecommit.getPullRequestApprovalStates, params);
};

// 39. Get Pull Request
const getPullRequest = async (params) => {
  return handleApiCall(codecommit.getPullRequest, params);
};

// 40. Get Pull Request Override State
const getPullRequestOverrideState = async (params) => {
  return handleApiCall(codecommit.getPullRequestOverrideState, params);
};

// 41. Get Repository
const getRepository = async (params) => {
  return handleApiCall(codecommit.getRepository, params);
};

// 42. Get Repository Triggers
const getRepositoryTriggers = async (params) => {
  return handleApiCall(codecommit.getRepositoryTriggers, params);
};

// 43. List Approval Rule Templates
const listApprovalRuleTemplates = async (params) => {
  return handleApiCall(codecommit.listApprovalRuleTemplates, params);
};

// 44. List Associated Approval Rule Templates For Repository
const listAssociatedApprovalRuleTemplatesForRepository = async (params) => {
  return handleApiCall(codecommit.listAssociatedApprovalRuleTemplatesForRepository, params);
};

// 45. List Branches
const listBranches = async (params) => {
  return handleApiCall(codecommit.listBranches, params);
};

// 46. List File Commit History
const listFileCommitHistory = async (params) => {
  return handleApiCall(codecommit.listFileCommitHistory, params);
};

// 47. List Pull Requests
const listPullRequests = async (params) => {
  return handleApiCall(codecommit.listPullRequests, params);
};

// 48. List Repositories
const listRepositories = async (params) => {
  return handleApiCall(codecommit.listRepositories, params);
};

// 49. List Repositories For Approval Rule Template
const listRepositoriesForApprovalRuleTemplate = async (params) => {
  return handleApiCall(codecommit.listRepositoriesForApprovalRuleTemplate, params);
};

// 50. List Tags For Resource
const listTagsForResource = async (params) => {
  return handleApiCall(codecommit.listTagsForResource, params);
};

// 51. Merge Branches By Fast Forward
const mergeBranchesByFastForward = async (params) => {
  return handleApiCall(codecommit.mergeBranchesByFastForward, params);
};

// 52. Merge Branches By Squash
const mergeBranchesBySquash = async (params) => {
  return handleApiCall(codecommit.mergeBranchesBySquash, params);
};

// 53. Merge Branches By Three Way
const mergeBranchesByThreeWay = async (params) => {
  return handleApiCall(codecommit.mergeBranchesByThreeWay, params);
};

// 54. Merge Pull Request By Fast Forward
const mergePullRequestByFastForward = async (params) => {
  return handleApiCall(codecommit.mergePullRequestByFastForward, params);
};

// 55. Merge Pull Request By Squash
const mergePullRequestBySquash = async (params) => {
  return handleApiCall(codecommit.mergePullRequestBySquash, params);
};

// 56. Merge Pull Request By Three Way
const mergePullRequestByThreeWay = async (params) => {
  return handleApiCall(codecommit.mergePullRequestByThreeWay, params);
};

// 57. Override Pull Request Approval Rules
const overridePullRequestApprovalRules = async (params) => {
  return handleApiCall(codecommit.overridePullRequestApprovalRules, params);
};

// 58. Post Comment For Compared Commit
const postCommentForComparedCommit = async (params) => {
  return handleApiCall(codecommit.postCommentForComparedCommit, params);
};

// 59. Post Comment For Pull Request
const postCommentForPullRequest = async (params) => {
  return handleApiCall(codecommit.postCommentForPullRequest, params);
};

// 60. Post Comment Reply
const postCommentReply = async (params) => {
  return handleApiCall(codecommit.postCommentReply, params);
};

// 61. Put Comment Reaction
const putCommentReaction = async (params) => {
  return handleApiCall(codecommit.putCommentReaction, params);
};

// 62. Put File
const putFile = async (params) => {
  return handleApiCall(codecommit.putFile, params);
};

// 63. Put Repository Triggers
const putRepositoryTriggers = async (params) => {
  return handleApiCall(codecommit.putRepositoryTriggers, params);
};

// 64. Tag Resource
const tagResource = async (params) => {
  return handleApiCall(codecommit.tagResource, params);
};

// 65. Test Repository Triggers
const testRepositoryTriggers = async (params) => {
  return handleApiCall(codecommit.testRepositoryTriggers, params);
};

// 66. Untag Resource
const untagResource = async (params) => {
  return handleApiCall(codecommit.untagResource, params);
};

// 67. Update Approval Rule Template Content
const updateApprovalRuleTemplateContent = async (params) => {
  return handleApiCall(codecommit.updateApprovalRuleTemplateContent, params);
};

// 68. Update Approval Rule Template Description
const updateApprovalRuleTemplateDescription = async (params) => {
  return handleApiCall(codecommit.updateApprovalRuleTemplateDescription, params);
};

// 69. Update Approval Rule Template Name
const updateApprovalRuleTemplateName = async (params) => {
  return handleApiCall(codecommit.updateApprovalRuleTemplateName, params);
};

// 70. Update Comment
const updateComment = async (params) => {
  return handleApiCall(codecommit.updateComment, params);
};

// 71. Update Default Branch
const updateDefaultBranch = async (params) => {
  return handleApiCall(codecommit.updateDefaultBranch, params);
};

// 72. Update Pull Request Approval Rule Content
const updatePullRequestApprovalRuleContent = async (params) => {
  return handleApiCall(codecommit.updatePullRequestApprovalRuleContent, params);
};

// 73. Update Pull Request Approval State
const updatePullRequestApprovalState = async (params) => {
  return handleApiCall(codecommit.updatePullRequestApprovalState, params);
};

// 74. Update Pull Request Description
const updatePullRequestDescription = async (params) => {
  return handleApiCall(codecommit.updatePullRequestDescription, params);
};

// 75. Update Pull Request Status
const updatePullRequestStatus = async (params) => {
  return handleApiCall(codecommit.updatePullRequestStatus, params);
};

// 76. Update Pull Request Title
const updatePullRequestTitle = async (params) => {
  return handleApiCall(codecommit.updatePullRequestTitle, params);
};

// 77. Update Repository Description
const updateRepositoryDescription = async (params) => {
  return handleApiCall(codecommit.updateRepositoryDescription, params);
};

// 78. Update Repository Encryption Key
const updateRepositoryEncryptionKey = async (params) => {
  return handleApiCall(codecommit.updateRepositoryEncryptionKey, params);
};

// 79. Update Repository Name
const updateRepositoryName = async (params) => {
  return handleApiCall(codecommit.updateRepositoryName, params);
};

module.exports = {
  associateApprovalRuleTemplateWithRepository,
  batchAssociateApprovalRuleTemplateWithRepositories,
  batchDescribeMergeConflicts,
  batchDisassociateApprovalRuleTemplateFromRepositories,
  batchGetCommits,
  batchGetRepositories,
  createApprovalRuleTemplate,
  createBranch,
  createCommit,
  createPullRequestApprovalRule,
  createPullRequest,
  createRepository,
  createUnreferencedMergeCommit,
  deleteApprovalRuleTemplate,
  deleteBranch,
  deleteCommentContent,
  deleteFile,
  deletePullRequestApprovalRule,
  deleteRepository,
  describeMergeConflicts,
  describePullRequestEvents,
  disassociateApprovalRuleTemplateFromRepository,
  evaluatePullRequestApprovalRules,
  getApprovalRuleTemplate,
  getBlob,
  getBranch,
  getComment,
  getCommentReactions,
  getCommentsForComparedCommit,
  getCommentsForPullRequest,
  getCommit,
  getDifferences,
  getFile,
  getFolder,
  getMergeCommit,
  getMergeConflicts,
  getMergeOptions,
  getPullRequestApprovalStates,
  getPullRequest,
  getPullRequestOverrideState,
  getRepository,
  getRepositoryTriggers,
  listApprovalRuleTemplates,
  listAssociatedApprovalRuleTemplatesForRepository,
  listBranches,
  listFileCommitHistory,
  listPullRequests,
  listRepositories,
  listRepositoriesForApprovalRuleTemplate,
  listTagsForResource,
  mergeBranchesByFastForward,
  mergeBranchesBySquash,
  mergeBranchesByThreeWay,
  mergePullRequestByFastForward,
  mergePullRequestBySquash,
  mergePullRequestByThreeWay,
  overridePullRequestApprovalRules,
  postCommentForComparedCommit,
  postCommentForPullRequest,
  postCommentReply,
  putCommentReaction,
  putFile,
  putRepositoryTriggers,
  tagResource,
  testRepositoryTriggers,
  untagResource,
  updateApprovalRuleTemplateContent,
  updateApprovalRuleTemplateDescription,
  updateApprovalRuleTemplateName,
  updateComment,
  updateDefaultBranch,
  updatePullRequestApprovalRuleContent,
  updatePullRequestApprovalState,
  updatePullRequestDescription,
  updatePullRequestStatus,
  updatePullRequestTitle,
  updateRepositoryDescription,
  updateRepositoryEncryptionKey,
  updateRepositoryName,
};
