
function createIndependentToolGroup(toolGroupService, viewportIndex) {
  const toolGroupId = `viewport-${viewportIndex}`;
  initDefaultToolGroup(toolGroupService, toolGroupId);
  return toolGroupId;
}

