const { expect } = require("chai");
const {
  classifyTemperatureBreach,
  checkAndAlert,
  getTemperatureLimits,
} = require("../src/typeWiseAlert");
const sinon = require("sinon");

describe("Temperature Classification and Alert Tests", () => {
  describe("Breach Status Tests", () => {
    it('TC001: should return "TOO_LOW" for temperature below lower limit for PASSIVE_COOLING', () => {
      expect(classifyTemperatureBreach("PASSIVE_COOLING", -5)).to.equal("TOO_LOW");
      expect(classifyTemperatureBreach("PASSIVE_COOLING", -10)).to.equal("TOO_LOW");
    });

    it('TC002: should return "TOO_HIGH" for temperature above upper limit for MED_ACTIVE_COOLING', () => {
      expect(classifyTemperatureBreach("MED_ACTIVE_COOLING", 50)).to.equal("TOO_HIGH");
      expect(classifyTemperatureBreach("HI_ACTIVE_COOLING", 46)).to.equal("TOO_HIGH");
    });

    it('TC003: should return "NORMAL" for temperature within limits', () => {
      expect(classifyTemperatureBreach("PASSIVE_COOLING", 20)).to.equal("NORMAL");
      expect(classifyTemperatureBreach("MED_ACTIVE_COOLING", 30)).to.equal("NORMAL");
    });
  });

  describe("Temperature Limits Tests", () => {
    it("should return correct limits for valid cooling types", () => {
      expect(getTemperatureLimits("PASSIVE_COOLING")).to.deep.equal({
        lower: 0,
        upper: 35,
      });
      expect(getTemperatureLimits("HI_ACTIVE_COOLING")).to.deep.equal({
        lower: 0,
        upper: 45,
      });
      expect(getTemperatureLimits("MED_ACTIVE_COOLING")).to.deep.equal({
        lower: 0,
        upper: 40,
      });
    });

    it("TC005: should throw an error for unknown cooling types", () => {
      expect(() => getTemperatureLimits("UNKNOWN_COOLING")).to.throw(Error, "Unknown cooling type");
    });
  });

  describe("Classify Temperature Breach Tests", () => {
    it("TC006: should classify temperature breach for PASSIVE_COOLING", () => {
      expect(classifyTemperatureBreach("PASSIVE_COOLING", 10)).to.equal("NORMAL");
      expect(classifyTemperatureBreach("PASSIVE_COOLING", -5)).to.equal("TOO_LOW");
    });

    it("TC007: should classify temperature breach for HI_ACTIVE_COOLING", () => {
      expect(classifyTemperatureBreach("HI_ACTIVE_COOLING", 50)).to.equal("TOO_HIGH");
      expect(classifyTemperatureBreach("HI_ACTIVE_COOLING", 10)).to.equal("NORMAL");
    });
  });

  describe("Alert Tests", () => {
    let consoleLogStub;

    beforeEach(() => {
      consoleLogStub = sinon.stub(console, "log");
    });

    afterEach(() => {
      consoleLogStub.restore();
    });

    it("TC008: should send alert to controller", () => {
      checkAndAlert("TO_CONTROLLER", { coolingType: "PASSIVE_COOLING" }, 25);
      expect(consoleLogStub.calledOnce).to.be.true; // Ensure the log was called once
      expect(consoleLogStub.calledWith("65261, NORMAL")).to.be.true; // Check for specific log output
    });

    it("TC009: should throw an error for unknown alert targets", () => {
      expect(() =>
        checkAndAlert("TO_UNKNOWN", { coolingType: "PASSIVE_COOLING" }, 25)
      ).to.throw(Error, "Unknown alert target");
    });

    it("TC010: should send email alert for temperature breach", () => {
      checkAndAlert("TO_EMAIL", { coolingType: "HI_ACTIVE_COOLING" }, 50);
      expect(consoleLogStub.calledWith("To: a.b@c.com\nHi, the temperature is too high")).to.be.true;
    });
  });
});
