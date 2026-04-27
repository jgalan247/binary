// ============================================
// Binary lesson - interactive demos + quiz
// ============================================

document.addEventListener("DOMContentLoaded", () => {
  setupBinaryDemo("binaryDemo", "demoBinary", "demoDenary", null, "resetDemo");
  setupBinaryDemo("convertDemo", "convertBinary", "convertDenary", "convertWorking", "resetConvert");
  setupBitChallenge("challenge1", [3, 6, 9, 12, 15, 18, 24, 31, 42, 55]);
  setupTypeChallenge("challenge2", [
    "00000010", "00000111", "00001100", "00010001", "00010110",
    "00011110", "00100100", "00101101", "00110000", "01000001"
  ]);
  setupQuiz();
});

// --------------------------------------------
// Interactive bit demo
// --------------------------------------------
function setupBinaryDemo(containerId, binaryOutId, denaryOutId, workingId, resetId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const cells = container.querySelectorAll(".bit-cell");
  const binaryOut = document.getElementById(binaryOutId);
  const denaryOut = document.getElementById(denaryOutId);
  const workingOut = workingId ? document.getElementById(workingId) : null;

  const update = () => {
    let binary = "";
    let total = 0;
    const onParts = [];
    cells.forEach(cell => {
      const value = parseInt(cell.dataset.value, 10);
      const isOn = cell.classList.contains("on");
      const bit = isOn ? "1" : "0";
      cell.querySelector(".bit").textContent = bit;
      binary += bit;
      if (isOn) {
        total += value;
        onParts.push(value);
      }
    });
    binaryOut.textContent = binary;
    denaryOut.textContent = total;
    if (workingOut) {
      workingOut.textContent = onParts.length === 0
        ? "Click bits to add up the values"
        : onParts.join(" + ") + " = " + total;
    }
  };

  cells.forEach(cell => {
    cell.addEventListener("click", () => {
      cell.classList.toggle("on");
      update();
    });
  });

  const resetBtn = document.getElementById(resetId);
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      cells.forEach(c => c.classList.remove("on"));
      update();
    });
  }
}

// --------------------------------------------
// Challenge: click bits to match a target denary
// --------------------------------------------
function setupBitChallenge(blockId, targets) {
  const block = document.getElementById(blockId);
  if (!block) return;

  const cells     = block.querySelectorAll(".bit-cell");
  const numEl     = block.querySelector(".ch-num");
  const scoreEl   = block.querySelector(".ch-score");
  const targetEl  = block.querySelector(".ch-target");
  const binEl     = block.querySelector(".ch-bin");
  const denEl     = block.querySelector(".ch-den");
  const fb        = block.querySelector(".ch-feedback");
  const nextBtn   = block.querySelector(".ch-next");
  const restartBt = block.querySelector(".ch-restart");

  let idx = 0;
  let score = 0;
  let solved = false;

  const clearBits = () => cells.forEach(c => c.classList.remove("on"));

  const render = () => {
    let binary = "";
    let total = 0;
    cells.forEach(cell => {
      const on = cell.classList.contains("on");
      cell.querySelector(".bit").textContent = on ? "1" : "0";
      binary += on ? "1" : "0";
      if (on) total += parseInt(cell.dataset.value, 10);
    });
    binEl.textContent = binary;
    denEl.textContent = total;

    const target = targets[idx];
    if (!solved && total === target) {
      solved = true;
      score++;
      scoreEl.textContent = score;
      fb.textContent = "✅ Correct! Click Next.";
      fb.className = "feedback ch-feedback good";
      nextBtn.disabled = false;
    } else if (!solved) {
      fb.textContent = "";
      fb.className = "feedback ch-feedback";
    }
  };

  const loadChallenge = () => {
    solved = false;
    clearBits();
    numEl.textContent = idx + 1;
    targetEl.textContent = targets[idx];
    fb.textContent = "";
    fb.className = "feedback ch-feedback";
    nextBtn.disabled = true;
    block.classList.remove("done");
    render();
  };

  cells.forEach(cell => cell.addEventListener("click", () => {
    if (solved) return;
    cell.classList.toggle("on");
    render();
  }));

  nextBtn.addEventListener("click", () => {
    if (idx < targets.length - 1) {
      idx++;
      loadChallenge();
    } else {
      block.classList.add("done");
      fb.textContent = "\u{1F389} All 10 done! Final score: " + score + " / " + targets.length;
      fb.className = "feedback ch-feedback good";
      nextBtn.disabled = true;
    }
  });

  restartBt.addEventListener("click", () => {
    idx = 0;
    score = 0;
    scoreEl.textContent = "0";
    loadChallenge();
  });

  loadChallenge();
}

// --------------------------------------------
// Challenge: type the denary for a binary
// --------------------------------------------
function setupTypeChallenge(blockId, binaries) {
  const block = document.getElementById(blockId);
  if (!block) return;

  const numEl     = block.querySelector(".ch-num");
  const scoreEl   = block.querySelector(".ch-score");
  const targetEl  = block.querySelector(".ch-target");
  const input     = block.querySelector(".ch-input");
  const fb        = block.querySelector(".ch-feedback");
  const checkBtn  = block.querySelector(".ch-check");
  const nextBtn   = block.querySelector(".ch-next");
  const restartBt = block.querySelector(".ch-restart");

  let idx = 0;
  let score = 0;
  let solved = false;

  const denaryOf = bin => parseInt(bin, 2);

  const loadChallenge = () => {
    solved = false;
    numEl.textContent = idx + 1;
    targetEl.textContent = binaries[idx];
    input.value = "";
    input.classList.remove("correct", "wrong");
    input.disabled = false;
    fb.textContent = "";
    fb.className = "feedback ch-feedback";
    checkBtn.disabled = false;
    nextBtn.disabled = true;
    block.classList.remove("done");
    input.focus();
  };

  const check = () => {
    if (solved) return;
    const expected = denaryOf(binaries[idx]);
    const given = parseInt(input.value.trim(), 10);
    if (given === expected) {
      solved = true;
      score++;
      scoreEl.textContent = score;
      input.classList.add("correct");
      input.disabled = true;
      fb.textContent = "✅ Correct! Click Next.";
      fb.className = "feedback ch-feedback good";
      checkBtn.disabled = true;
      nextBtn.disabled = false;
    } else {
      input.classList.remove("correct");
      input.classList.add("wrong");
      fb.textContent = "❌ Not quite - try again.";
      fb.className = "feedback ch-feedback bad";
    }
  };

  input.addEventListener("input", () => input.classList.remove("wrong"));
  input.addEventListener("keydown", e => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (solved) nextBtn.click();
      else check();
    }
  });
  checkBtn.addEventListener("click", check);

  nextBtn.addEventListener("click", () => {
    if (idx < binaries.length - 1) {
      idx++;
      loadChallenge();
    } else {
      block.classList.add("done");
      fb.textContent = "\u{1F389} All 10 done! Final score: " + score + " / " + binaries.length;
      fb.className = "feedback ch-feedback good";
      nextBtn.disabled = true;
      checkBtn.disabled = true;
    }
  });

  restartBt.addEventListener("click", () => {
    idx = 0;
    score = 0;
    scoreEl.textContent = "0";
    loadChallenge();
  });

  loadChallenge();
}

// --------------------------------------------
// Quiz / test
// --------------------------------------------
function setupQuiz() {
  const checkBtn = document.getElementById("checkBtn");
  const resetBtn = document.getElementById("resetQuiz");
  const scoreBox = document.getElementById("scoreBox");
  const scoreNum = document.getElementById("scoreNum");
  const scoreMsg = document.getElementById("scoreMessage");

  if (!checkBtn) return;

  // Live feedback as students type
  document.querySelectorAll(".quiz-input").forEach(input => {
    input.addEventListener("input", () => {
      input.classList.remove("correct", "wrong");
    });
  });

  checkBtn.addEventListener("click", () => {
    let score = 0;
    let total = 0;

    // Text input questions
    document.querySelectorAll(".quiz-input").forEach(input => {
      total++;
      const expected = input.dataset.answer.trim();
      const type = input.dataset.type;
      let given = input.value.trim();

      if (type === "binary") {
        // accept with or without leading zeros, allow spaces
        given = given.replace(/\s+/g, "");
        // pad to 8 bits if shorter
        if (/^[01]+$/.test(given)) {
          given = given.padStart(8, "0");
        }
      }

      const correct = given === expected;
      input.classList.remove("correct", "wrong");
      input.classList.add(correct ? "correct" : "wrong");
      if (correct) score++;
    });

    // Multiple choice
    document.querySelectorAll(".q.mcq").forEach(q => {
      total++;
      const expected = q.dataset.answer;
      const checked = q.querySelector("input[type=radio]:checked");
      q.classList.remove("correct", "wrong");
      if (checked && checked.value === expected) {
        q.classList.add("correct");
        score++;
      } else {
        q.classList.add("wrong");
      }
    });

    scoreBox.classList.remove("hidden");
    scoreNum.textContent = score;

    let msg = "";
    if (score === total) msg = "Amazing! Full marks! \u{1F389}";
    else if (score >= 8) msg = "Great work! Almost there.";
    else if (score >= 5) msg = "Good effort - have another try at the red ones.";
    else msg = "Don't worry - watch the video again and try once more.";
    scoreMsg.textContent = msg;

    scoreBox.scrollIntoView({ behavior: "smooth", block: "center" });
  });

  resetBtn.addEventListener("click", () => {
    document.querySelectorAll(".quiz-input").forEach(i => {
      i.value = "";
      i.classList.remove("correct", "wrong");
    });
    document.querySelectorAll(".q.mcq").forEach(q => {
      q.classList.remove("correct", "wrong");
      q.querySelectorAll("input[type=radio]").forEach(r => (r.checked = false));
    });
    scoreBox.classList.add("hidden");
  });
}
