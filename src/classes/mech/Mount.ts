import uuid from 'uuid/v4'
import { store } from '@/store'
import { MechWeapon, WeaponSlot, MountType, FittingSize, WeaponSize } from '@/class'

abstract class Mount {
  private _mount_type: MountType
  private _id: string
  protected lock: boolean
  protected slots: WeaponSlot[]
  protected extra: WeaponSlot[]
  protected _name_override: string

  public constructor(mountType: MountType) {
    this._id = uuid()
    this._mount_type = mountType
    this.lock = false
    this.extra = []
    this._name_override = ''
    this.slots = []
    this.generateSlots(mountType)
  }

  protected generateSlots(mountType: MountType): void {
    if (mountType === MountType.Integrated) {
      this.slots = [new WeaponSlot(FittingSize.Integrated)]
    } else {
      if (mountType === MountType.AuxAux) {
        this.slots = [new WeaponSlot(FittingSize.Auxiliary), new WeaponSlot(FittingSize.Auxiliary)]
      } else if (mountType === MountType.Aux) {
        this.slots = [new WeaponSlot(FittingSize.Auxiliary)]
        this._name_override = 'Integrated Weapon'
      } else if (mountType === MountType.MainAux) {
        this.slots = [new WeaponSlot(FittingSize.Main), new WeaponSlot(FittingSize.Auxiliary)]
      } else if (mountType === MountType.Flex) {
        this.slots = [new WeaponSlot(FittingSize.Flex)]
        this.extra = [new WeaponSlot(FittingSize.Auxiliary)]
      } else if (mountType === MountType.Main) {
        this.slots = [new WeaponSlot(FittingSize.Main)]
      } else {
        this.slots = [new WeaponSlot(FittingSize.Heavy)]
      }
    }
  }

  protected save(): void {
    store.dispatch('saveData')
  }

  protected getID(): void {
    this._id = uuid()
  }

  public get ID(): string {
    return this._id
  }

  public get Type(): MountType {
    return this._mount_type
  }

  public get Name(): string {
    return this._name_override ? this._name_override : `${this.Type} Mount`
  }

  public get Slots(): WeaponSlot[] {
    if (!this.slots[0]) this.generateSlots(this.Type)
    const isFlex = this.Type == MountType.Flex && this._name_override !== 'Retrofitted Mount'

    if (isFlex) {
      if (
        this.slots[0].Weapon?.Size === WeaponSize.Aux ||
        (!this.slots[0].Weapon && this.extra[0].Weapon)
      ) {
        return this.slots.concat(this.extra)
      } else if (
        this.slots[0].Weapon?.Size === WeaponSize.Main && 
        this.extra[0].Weapon
      ) {
        this.extra[0].UnequipWeapon()
      }
    }
    return this.slots
  }

  public set Slots(slots: WeaponSlot[]) {
    this.slots = slots
  }

  public get AvailableFittings(): string {
    let result = ''

    switch (this.Type) {
      case MountType.Aux:
        result = 'Auxiliary'
        break
      case MountType.AuxAux:
        result = 'Auxiliary & Auxiliary'
        break
      case MountType.Flex:
        result = 'Main | Auxiliary & Auxiliary'
        break
      case MountType.Heavy:
        result = 'Superheavy | Heavy | Main | Aux'
        break
      case MountType.Integrated:
        result = 'Integrated'
        break
      case MountType.Main:
        result = 'Main | Auxiliary'
        break
      case MountType.MainAux:
        result = 'Main & Auxiliary | Auxiliary & Auxiliary'
        break
    }

    return result
  }

  public get Weapons(): MechWeapon[] {
    return this.Slots.map(x => x.Weapon).filter(y => y !== null) as MechWeapon[]
  }

  public get IsLocked(): boolean {
    return this.lock
  }
}

export default Mount
