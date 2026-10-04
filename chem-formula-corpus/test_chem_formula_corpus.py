from pathlib import Path
import sqlite3
from chem_formula_corpus import ValidationStatus, parse_formula, CorpusStore, ingest_sdf


def test_simple_formula():
    r = parse_formula("C6H12O6")
    assert r.status is ValidationStatus.VALID
    assert r.normalized == "C6H12O6"
    assert r.counts == {"C":6,"H":12,"O":6}


def test_parentheses():
    r = parse_formula("Ca(OH)2")
    assert r.status is ValidationStatus.VALID
    assert r.counts == {"Ca":1,"O":2,"H":2}


def test_hydrate():
    r = parse_formula("CuSO4·5H2O")
    assert r.status is ValidationStatus.VALID
    assert r.counts == {"Cu":1,"S":1,"O":9,"H":10}


def test_nested_brackets():
    r = parse_formula("K4[Fe(CN)6]")
    assert r.status is ValidationStatus.VALID
    assert r.counts == {"K":4,"Fe":1,"C":6,"N":6}


def test_invalid_element():
    r = parse_formula("Xx2O")
    assert r.status is ValidationStatus.INVALID


def test_mismatched_bracket():
    assert parse_formula("Ca(OH]2").status is ValidationStatus.INVALID


def test_unsupported_notation_not_falsely_accepted():
    assert parse_formula("C6H5{13C}O").status is ValidationStatus.UNSUPPORTED


def test_pubchem_ingest_dedup_preserves_provenance(tmp_path: Path):
    sdf = tmp_path / "sample.sdf"
    sdf.write_text("""water\n test\n\n> <PUBCHEM_COMPOUND_CID>\n962\n\n> <PUBCHEM_MOLECULAR_FORMULA>\nH2O\n\n$$$$\nwater2\n test\n\n> <PUBCHEM_COMPOUND_CID>\n999999\n\n> <PUBCHEM_MOLECULAR_FORMULA>\nH2O\n\n$$$$\nglucose\n test\n\n> <PUBCHEM_COMPOUND_CID>\n5793\n\n> <PUBCHEM_MOLECULAR_FORMULA>\nC6H12O6\n\n$$$$\n""", encoding="utf-8")
    db = tmp_path / "db.sqlite3"
    with CorpusStore(db) as store:
        accepted, skipped = ingest_sdf(sdf, store, "pubchem")
        stats = store.stats()
    assert (accepted, skipped) == (3, 0)
    assert stats.formulas == 2
    assert stats.valid == 2
    assert stats.source_records == 3
    conn = sqlite3.connect(db)
    try:
        hashes = [x[0] for x in conn.execute("SELECT record_sha256 FROM source_records")]
        assert len(hashes) == 3 and all(len(x) == 64 for x in hashes)
    finally:
        conn.close()


def test_chebi_formulae_field(tmp_path: Path):
    sdf = tmp_path / "chebi.sdf"
    sdf.write_text("""water\n test\n\n> <ChEBI ID>\nCHEBI:15377\n\n> <Formulae>\nH2O\n\n$$$$\n""", encoding="utf-8")
    db = tmp_path / "db.sqlite3"
    with CorpusStore(db) as store:
        accepted, skipped = ingest_sdf(sdf, store, "chebi")
        stats = store.stats()
    assert (accepted, skipped) == (1, 0)
    assert stats.valid == 1
