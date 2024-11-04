import { LengthUnit, MassUnit, VolumeUnit } from "interfaces/enums/GlobalEnums";
import {
  Length,
  LengthDto,
  Mass,
  MassDto,
  Volume,
  VolumeDto,
} from "unitsnet-js";

export const convertLengthToSi = (lengthUnit: LengthUnit, value?: number) => {
  if (lengthUnit !== LengthUnit.Undefined) {
    if (value !== undefined && value > 0) {
      let lengthDto: LengthDto = {
        value: value,
        unit: lengthUnit,
      };
      return Length.FromDto(lengthDto).convert(LengthUnit.Meters);
    }
  }
  return 0;
};

export const convertLengthFromSi = (lengthUnit: LengthUnit, value?: number) => {
  if (lengthUnit !== LengthUnit.Undefined) {
    if (value !== undefined && value > 0) {
      let lengthDto: LengthDto = {
        value: value,
        unit: LengthUnit.Meters,
      };
      return Length.FromDto(lengthDto).convert(lengthUnit);
    }
  }
  return 0;
};

export const convertMassToSi = (massUnit: MassUnit, value?: number) => {
  if (massUnit !== MassUnit.Undefined) {
    if (value !== undefined && value > 0) {
      let massDto: MassDto = {
        value: value,
        unit: massUnit,
      };
      return Mass.FromDto(massDto).convert(MassUnit.Kilograms);
    }
  }
  return 0;
};

export const convertMassFromSi = (massUnit: MassUnit, value?: number) => {
  if (massUnit !== MassUnit.Undefined) {
    if (value !== undefined && value > 0) {
      let massDto: MassDto = {
        value: value,
        unit: MassUnit.Kilograms,
      };
      return Mass.FromDto(massDto).convert(massUnit);
    }
  }
  return 0;
};

export const convertVolumeToSi = (volumeUnit: VolumeUnit, value?: number) => {
  if (volumeUnit !== VolumeUnit.Undefined) {
    if (value !== undefined && value > 0) {
      let volumeDto: VolumeDto = {
        value: value,
        unit: volumeUnit,
      };
      return Volume.FromDto(volumeDto).convert(VolumeUnit.CubicMeters);
    }
  }
  return 0;
};

export const convertVolumeFromSi = (volumeUnit: VolumeUnit, value?: number) => {
  if (volumeUnit !== VolumeUnit.Undefined) {
    if (value !== undefined && value > 0) {
      let volumeDto: VolumeDto = {
        value: value,
        unit: VolumeUnit.CubicMeters,
      };
      return Volume.FromDto(volumeDto).convert(volumeUnit);
    }
  }
  return 0;
};
